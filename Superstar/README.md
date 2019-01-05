# Superstar

Im sozialen Netzwerk TeeniGram können Mitglieder anderen Mitgliedern „folgen“. Natürlich können sich zwei Personen gegenseitig folgen, was auch oft vorkommt.

Eine Spezialität von TeeniGram ist die Superstar- Funktion von Gruppen. Ein Mitglied X einer Gruppe heißt Superstar der Gruppe, wenn alle anderen Mitglieder der Gruppe dem Mitglied X folgen, aber X selbst keinem anderen Mitglied der Gruppe folgt.

Ein Beispiel: Eine kleine Gruppe hat drei Mitglieder, nämlich Selena, Justin und Hailey. Selena folgt Justin, Hailey folgt Justin und Hailey folgt Selena. Justin ist der Superstar.

Werbetreibende wollen sehr gerne wissen, wer in einer Gruppe der Superstar ist. In TeeniGram ist es aber nicht so einfach, an Informationen heranzu- kommen. Nur Anfragen der Form „Folgt Mitglied
Y Mitglied Z?“ sind erlaubt, und jede Anfrage kostet einen ganzen Euro. Deshalb sollen möglichst wenige Anfragen gestellt werden.

> Zitiert von der offiziellen Beschreibung der Aufgabe des BwInf 2018

## Umsetzung

Die Umsetzung basieet generell auf einer generischen Klasse für eine **TeeniGram** Gruppe.
Das Herausfinden eine Superstars ist hier also nur eine Methode (und auch die einzige) eines gesamtheitlichen Moduls.
Selbstvertändlich wäre es auch möglich gewesen, das alles nur in eine Funktion zu packen aber für mich besteht modulare Entwicklung von Software aus der Erweiterbarkeit und der Möglichkeit jederzeit zu skalieren.

Auch die Umsetzung der einzelnen Gruppenmitgleider (*Member*) ist hier eine sehr objektorientierte und modulare.
Es hätte in unserem konkreten Fall natprkich auch gereicht, die Gruppenmitglieder einfach als Objekte darzustellen und deren Abhängigkeiten zueinander in Form von Following nur über die Liste der Indexes zu gestalten.

Stattdessen habe ich aber bewusst auch die Member als eigene Instanz gedacht welche ihrerseits wiederum die dynamischen Properties [Getter] zu ihren Followern und den Gefolgten bieten. Jedes Member ist also eine Instanz der Klasse **Member** und gibt mit der Property `following` und `followers` wiederum eine Liste von `Member`-Instanzen aus.

Ziel war es eben auch nicht nur eine adäquate Lösung zu liefern sondern auch noch ein modulares und sauberes Stück Softwaremit einer guten und sinnvollen API.


## Algorithmik

Der von mir entwickelte Algorithmus funktioniert wie folgt:

Grundsätzlich kommt zu Beginn jedes Member in Frage ein *Superstar* zu sein.
1. Daher wird auf erster Ebene jedes Member durchgeganen und geschaut ob es ein Superstar ist.
2. Die Frage, ob ein Member ein Superstar ist wird grundsätzlich damit beantwortet indem für jedes andere Member gefragt wird, ob es denn dem potentiellen Supertsar folgen würde.
3. Um die Anfragen an die TeenieGram API zu minmimieren kommen folgende Verbesserungen hinzu:
  - Wird während des Überprüfens aller anderen Members festestellt, dass irgendein Member dem potentiellen SUperstar **nicht** folgt, wird die Suche abgebrochen und es geht direkt weiter mit dem nächsten *"Kandidaten"*.
  - Sollte ein Member dem potentiellen Superstar allerdings tatsächlich folgen, geht zwar die Überprüfung für die restlichen Members weiter, wird dieser Member aber auf eine Liste der *disqualifizierten Members* gesetzt. Er würde also ab ab jetzt direkt als Superstar ausgeschlossen werden. Das heißt, es würde auf keinen Fall mehr auch nur der Versuch unternommen werden, er könne ein Superstar sein.

**Dies ergibt die minimal mögliche Anfragen an die TeenieGram API.**

## Require

```javascript
// Require the module using Common JS
const TeeniGramGroup = require('TeenieGramGroup');
```

### Initialize Group

```javascript
// Initialize group with group template that described the relationships between the members and wether they follow each other
const myTeeniGrammGroup = new TeeniGramGroup(groupTemplate);
```

#### Template Syntax

```javascript
[
  ...,
  {
    name: "Alex", // Name of member
    following: [0, 2, 3] // Indexes of members Alex follows
  },
  ...
]
```

### Get Superstar

```javascript
const superstar = myTeeniGrammGroup.getSuperstar();

// Returns an object
{
  superstar: <Member>, // Instance of a member
  requests: <Number> // Number of needed requests
}
```

### Example

This example uses a small group template with 4 persons:


```javascript
// Create template of group
const groupTemplate = [
  {
    "name": "Alex",
    "following": []
  },
  {
    "name": "Lisa",
    "following": [0]
  },
  {
    "name": "David",
    "following": [0, 1, 3]
  },
  {
    "name": "Johannes",
    "following": [0, 1, 2]
  }
];
// Initialize group instance with template
const myTeeniGrammGroup = new TeeniGramGroup(groupTemplate);
// Get the superstar (if existing)
const superstarResult = myTeeniGrammGroup.getSuperstar();

if (superstar) {
  console.log("Der Superstar ist " + superstarResult.superstar.name + "!");
  console.log("Dafür wurden " + superstar.requests + " Anfragen an die API von TeenieGram gestellt.");
}
else {
  console.log("Leider wurde kein Superstar gefunden.");
}
```

### Umsetzung für Beispielaufgaben

Da die Beispielaufgaben auf der Seite des BwInf 2018 nicht in dem von mir für das Modul vorgesehene Format vorliegen sondern in einem sehr simplen TXT Format, war es natürlich noch Ziel eine Anwendung zu entwickeln die die Nutzung der Beispiele auf der BwInf 2018 Seite als *Group Templates* möglicht macht.

Da ich sowieso noch ein CLI für das Modul entwickelen wollte welches Dateien oder URL's als *Group Templates* einliest, habe ich dort auch direkt die Unterstützung für die etwas eigene und weniger komplexe Syntax der Beispiel auf der BwInf 2018 Seite implementiert.

Diese Syntax funktioniert wie folgt;

> Jede Datei enthält bis zu 5.000 Zeilen, und jede Zeile ist bis zu 500 Zeichen lang.
> Dabei enthält:
> die erste Zeile die durch Leerzeichen voneinander getrennten Namen aus dem TeeniGram-Netzwerk,
jede der folgenden Zeilen jeweils die Information „X Y“ über zwei beliebige Namen X und Y, wenn X Y folgt.

Beispiel: https://bwinf.de/fileadmin/user_upload/BwInf/2018/37/1._Runde/Material/superstar1.txt



## CLI

### URL

```bash
$ node /demo/cli --group https://bwinf.de/fileadmin/user_upload/BwInf/2018/37/1._Runde/Material/superstar1.txt
```

### File

```bash
$ node /demo/cli --group /demo/superstar1.txt
```
