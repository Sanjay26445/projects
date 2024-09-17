from tkinter import *
from PIL import ImageTk, Image
from tkinter.ttk import Combobox
from bs4 import BeautifulSoup
import requests
import re

class CricketScore:
    def __init__(self, rootWindow):
        self.rootWindow = rootWindow
        self.rootWindow.title("LIVE CRICKET SCORE")
        self.rootWindow.geometry('800x600')

        self.bg = Image.open("cric.jpg")
        self.bg = self.bg.resize((1200, 1900), resample=Image.LANCZOS)
        self.bg = ImageTk.PhotoImage(self.bg)
        bg = Label(self.rootWindow, image=self.bg)
        bg.place(x=0, y=0, relwidth=1, relheight=1)

        self.label = Label(self.rootWindow, text='Live Matches', font=("times new roman", 30, "bold"), fg="white", bg="black")
        self.label.pack(padx=100, pady=20)

        self.matches = self.match_details()
        self.data = [i for i in self.matches.keys()]
        self.cb = Combobox(self.rootWindow, values=self.data, width=50, font=("times new roman", 15))
        self.cb.pack(padx=20, pady=20)

        self.b1 = Button(self.rootWindow, text="Check Score", font=("times new roman", 15), command=self.show_match_details)
        self.b1.pack(padx=20, pady=20)

    def select(self):
        return self.cb.get()

    def scrap(self):
        URL = "https://www.cricbuzz.com/"
        page = requests.get(URL)
        soup = BeautifulSoup(page.content, "html.parser")
        results = soup.find(id="match_menu_container")
        scrap_results = results.find_all("li", class_="cb-match-card")
        return scrap_results

    def match_details(self):
        details = self.scrap()
        live_match = {}
        for detail in details:
            live_team_details = {}
            summary = self.match_summary(detail)
            if summary is not None:
                match_header = self.match_header(detail).text
                teams = self.teams_name(detail)
                score_card = self.team_score(detail)
                live_team_details['summary'] = summary.text
                live_team_details['match_header'] = match_header
                live_team_details['score_card'] = score_card[0] + " :: " + score_card[1]
                live_match[teams[0] + " vs " + teams[1]] = live_team_details

        return live_match

    def match_summary(self, detail):
        return detail.find("div", class_="cb-mtch-crd-state")

    def match_header(self, detail):
        return detail.find("div", class_="cb-mtch-crd-hdr")

    def teams_name(self, detail):
        l = []
        team1_details = detail.find("div", class_="cb-hmscg-bat-txt").text
        team1_index = re.search(r"\d", team1_details).start() if re.search(r"\d", team1_details) else len(team1_details)
        team2_details = detail.find("div", class_="cb-hmscg-bwl-txt").text
        team2_index =  re.search(r"\d", team2_details).start()  if re.search(r"\d", team2_details) else len(team2_details)
        l.append(team1_details[:team1_index])
        l.append(team2_details[:team2_index])
        return l

    def team_score(self, detail):
        l = []
        team1_details = detail.find("div", class_="cb-hmscg-bat-txt").text
        team2_details = detail.find("div", class_="cb-hmscg-bwl-txt").text
        l.append(team1_details)
        l.append(team2_details)
        return l

    def show_match_details(self):
        self.frame1 = Frame(self.rootWindow, bg="#ADD8E6")
        self.frame1.pack(padx=20, pady=20)

        x = self.matches[self.select()]

        Label(self.frame1, text=self.select() + " - " + x['match_header'], font=("times new roman", 15, "bold"), bg="#ADD8E6", fg="red",
              bd=0).pack(pady=10)

        Label(self.frame1, text="Score Details : ", font=("times new roman", 10, "bold"), bg="#ADD8E6", fg="black",
              bd=0).pack(pady=5)
        Label(self.frame1, text=x['score_card'], font=("times new roman", 10, "bold"), bg="#ADD8E6", fg="black",
              bd=0).pack(pady=5)
        
        
# Main function - Start point of the application
def main():
    # creating tkinter window
    rootWindow = Tk()
    
    # creating object for class cricket_score
    obj = CricketScore(rootWindow)
   
    # starting the gui
    rootWindow.mainloop()


if __name__ == "__main__":
    # ==== calling main function
    main()
