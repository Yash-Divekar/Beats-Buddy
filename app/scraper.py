from selenium import webdriver
from bs4 import BeautifulSoup
import requests

def get_google_search_html(query):
    url = f'https://www.google.com/search?q={query}+&sitesearch=ww-pagalworld.com'
    options = webdriver.ChromeOptions()
    options.add_argument('--headless')

    driver = webdriver.Chrome(options=options)
    driver.get(url)

    # Wait for JavaScript to execute (you might need to adjust this)
    driver.implicitly_wait(5)

    html_content = driver.page_source
    driver.quit()

    return html_content

# Example usage
if __name__ == '__main__':
    url=f'https://saavn.me/search/all?query=teri+ore&page=1&limit=2'
    
    data=requests.get(url)
    print(data)
    """search_query = "Shape+of+you"
    html_content = get_google_search_html(search_query)
    
    soup = BeautifulSoup(html_content , 'html.parser')
    
    container = soup.find('div' , class_='GyAeWb')
    temp=container.find_all('a')
    links =[x.get('href') for x in temp[0:10] if x!='#']
    print(links)"""
# Now you can use BeautifulSoup or other parsers to extract information
