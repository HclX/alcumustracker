import requests
from datetime import date, datetime
from bs4 import BeautifulSoup
import os.path
import simplejson as json

URL = f'https://bellevue.aopsacademy.org/my-academy/alcumus-contest'
TABLE_NAMES = ['Prealgebra', 'Algebra 1', 'Geometry', 'Algebra 2']

def load_page():
    page = requests.get(URL)
    fname = os.path.join('debug', datetime.now().strftime("%Y%m%d-%H%M%S") + ".html")
    open(fname, 'w').write(page.text)
    return page.text

def parse_table(table):
    trs = table.select('tbody tr')
    row = {}
    for tr in trs:
        name = tr.find('td', class_='name').text
        score = tr.find('td', class_='score').text.replace(',', '')
        row[name] = int(score)
    return row

def main():
    with open('docs/data.json', 'r') as f:
        data = json.load(f)

    today = date.today().strftime('%m/%d/%Y')
    if today in data['dates']:
        print(f"already updated for {today}")
        return

    page = load_page()
    doc = BeautifulSoup(page, 'html.parser')
    h4s = doc.find_all('h4')
    for h4 in h4s:
        level = h4.text
        if level not in TABLE_NAMES:
            continue
        row = parse_table(h4.find_next_sibling('table'))
        for name, score in row.items():
            if name not in data['data'][level]:
                data['data'][level][name] = [0] * len(data['dates'])
            data['data'][level][name].append(score)
    data['dates'].append(today)

    with open('docs/data.json', 'w') as f:
        json.dump(data, f, indent=2, ignore_nan=True)

main()
