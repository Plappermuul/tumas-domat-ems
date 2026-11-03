# Die Tumas von Domat/Ems – Website-Prototyp

## Inhalt
- `index.html`: Website
- `style.css`, `task1.css` und `task2.css`: Gestaltung, responsive Aufgabenlayouts und Zuordnungsspiel
- `app.js` und `data.js`: Interaktionen und Inhalte
- `assets/`: Bilder, MP3-Hörbuch und die fünf schriftfreien Kacheln zur Entstehung der Tumas

## Lokal testen
Öffne `index.html` im Browser. Für eine zuverlässigere lokale Vorschau kannst du im Projektordner einen lokalen Webserver starten, z. B. in VS Code mit der Erweiterung Live Server.

## Auf GitHub Pages veröffentlichen
1. Erstelle auf GitHub ein Repository, z. B. `tumas-domat-ems`.
2. Lade alle Dateien und den Ordner `assets` aus diesem ZIP ins Hauptverzeichnis des Repositories hoch. `index.html` muss direkt im Hauptverzeichnis liegen.
3. Öffne **Settings → Pages**.
4. Unter **Build and deployment** wählst du **Deploy from a branch**, danach `main` und `/ (root)`, und speicherst.
5. Warte, bis GitHub Pages die Website veröffentlicht. Die URL erscheint auf der Pages-Seite.

## Aufgabenfolge
- **Aufgabe 1 – Entstehung der Tumas:** Zuerst ordnen die Schülerinnen und Schüler fünf schriftfreie Bildkacheln. Danach verbinden sie jede Bildkachel mit dem passenden separaten Text. Die Karten funktionieren durch Antippen.
- **Aufgabe 2 – Tumas erkunden:** Infotexte zu den zwölf heutigen Tumas und zu den besonderen beziehungsweise historischen Tumas. Die Casté-Detailansicht enthält zusätzlich das YouTube-Video.
- **Aufgabe 3 – Tumas auf Bildern und Karte finden:** Zuordnung auf zwei Bildern und auf der interaktiven swisstopo-Karte. Für die Kartenansicht ist eine Internetverbindung nötig.
- **Aufgabe 4 – Romanische und deutsche Namen verbinden:** Bedeutungen ziehen oder auf Tablets antippen. Richtige Paare bleiben liegen, falsche springen zurück.

Die Aufgaben sind über die Startseite frei wählbar. Alle fünf verwendeten Bilder zur Entstehung liegen unter `assets/entstehung/`; ihre separate Textfassung ist in `data.js` hinterlegt.
