import os
import re
import cv2
import pytesseract
from pytesseract import Output
import pandas as pd

def process_image(image_path,year_dir,year):
    try:
        image = cv2.imread(image_path)
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        ocr_data = pytesseract.image_to_data(gray, config='--oem 3 --psm 11', output_type=Output.DICT)

        score_y, score_height= None, 0

        for i, word in enumerate(ocr_data['text']):
            if "score" in word.lower():
                score_y = ocr_data['top'][i]
                score_height = ocr_data['height'][i]
                break

        if score_y is None:
            return None
        else:
            y1 = max(0, score_y - 35)
            y2 = min(image.shape[0], score_y + score_height + 5)
            cropped = image[y1:y2, :]
            row_text = pytesseract.image_to_string(cropped, config='--oem 3 --psm 6')
            lines = [line.strip() for line in row_text.splitlines() if line.strip()]
            if len(lines) < 2:
                return None
            else:
                score_line = lines[1]
                parameters = [f'SS_{year}', f'FSR_{year}', f'FQE_{year}', f'FRU_{year}',
                              f'PU_{year}', f'QP_{year}', f'IPR_{year}', f'FPPP_{year}',
                              f'GPHE_{year}', f'GUE_{year}', f'MS_{year}', f'GPHD_{year}',
                              f'RD_{year}', f'WD_{year}', f'ESCS_{year}', f'PCS_{year}', f'PR_{year}']
                scores = []
                new_scoreline = score_line.replace("Score", "").replace("score", "").replace("|", "")
                raw_tokens = re.split(r'[ \-_—«]+', new_scoreline)
                for token in raw_tokens:
                    token = re.sub(r'[^A-Za-z0-9.]', '', token)
                    if year_dir == "output2022":
                        if len(token) > 2 and token.isalpha():
                            token = '0.0'
                    elif year_dir == "output2018":
                        if token.isalpha():
                                token = '0.0'
                    else:
                        if len(token) > 1 and token.isalpha():
                            token = '0.0'
                    if len(token) < 2:
                        match = re.search(r'[-+]?\d*\.\d+|\d+', token)
                        if match:
                            number = float(match.group())
                            if '.' not in token and number < 10:
                                continue
                    if token.count('.') > 1:
                        second_dot_index = [i for i, c in enumerate(token) if c == '.'][1]
                        token = token[:second_dot_index]
                    cleaned = re.sub(r"[^\d.]", "", token)
                    try:
                        if float(cleaned) > 10000000:
                            cleaned = float(cleaned)/10000
                            a, b = str(cleaned).split('.')
                            scores.append(float(a))
                            scores.append(float(b))
                        else:
                            scores.append(float(cleaned))
                    except:
                        continue

                for i in range(17):
                    if ((scores[0] > 20 and i == 0) or (scores[1] > 30 and i == 1) or
                        (scores[2] > 20 and i == 2) or (scores[3] > 30 and i == 3) or
                        (scores[4] > 35 and i == 4) or (scores[5] > 40 and i == 5) or
                        (scores[6] > 15 and i == 6) or (scores[7] > 10 and i == 7) or
                        (scores[8] > 40 and i == 8) or (scores[9] > 15 and i == 9) or
                        (scores[10] > 25 and i == 10) or (scores[11] > 20 and i == 11) or
                        (scores[12] > 30 and i == 12) or (scores[13] > 30 and i == 13) or
                        (scores[14] > 20 and i == 14) or (scores[15] > 21 and i == 15) or
                            (scores[16] > 100 and i == 16)):
                        scores[i] = scores[i]/100

                if len(parameters) == len(scores):
                    return pd.DataFrame([scores], columns=parameters)
                return None
                
    except:
        return None

def process_all(root_dir,year):
    for college_dir in os.listdir(root_dir):
        full_path = os.path.join(root_dir,college_dir)
        if not os.path.isdir(full_path):
            continue

        img_path = os.path.join(full_path, "parms.png")
        if not os.path.exists(img_path):
            print(f"⚠️ Skipping {college_dir}: No image found.")
            continue

        output_path = os.path.join(full_path, "parameter_scores.csv")
        if os.path.exists(output_path):
            continue
        
        df = process_image(img_path,root_dir,year)
        if df is not None:
            df.to_csv(output_path, index=False)
        else:
            print(f"❌ OCR failed for {college_dir}")
    print(f"Processed for year {year}\n")

def call_func(year):
    root_folder = f"output{year}" 
    process_all(root_folder,year)
