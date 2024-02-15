const { google } = require("googleapis");

function situationCheck(average, absence) {
  if (absence <= 15) {
    if (average >= 70) {
      return "Aprovado";
    } else if (average >= 50 && average < 70) {
      return "Prova Final";
    } else {
      return "Reprovado por Nota";
    }
  } else {
    return "Reprovado por Falta";
  }
}

function calculateNAF(average) {
  return 100 - average;
   
}

const auth = new google.auth.GoogleAuth({
  keyFile:
    "C://Users//victo//Desktop//Development//Vscode/TuntsRocks/credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const spreadsheetId = "1GNw9IFnNXapd8FcOzcuC11aYLUjQxOmqf4tLT8hkNyo";
const range = "A4:F27";

sheets.spreadsheets.values.get(
  {
    spreadsheetId,
    range,
  },
  (err, res) => {
    if (err) return console.log("Spreadsheet not found", err);

    const rows = res.data.values;

    if (rows.length) {
      console.log("Grades: \n");
      rows.forEach((row) => {
        const id = row[0];
        const name = row[1];
        const absence = parseInt(row[2]);
        const p1 = parseFloat(row[3]);
        const p2 = parseFloat(row[4]);
        const p3 = parseFloat(row[5]);
        const average = (p1 + p2 + p3) / 3;
        const situation = situationCheck(average, absence);

        if (situation === "Prova Final") {
          const naf = calculateNAF(average);
          console.log(
            `${name} AVG: ${average.toFixed(
              2
            )}\nAbsences: ${absence}\nSituation: ${situation}\nFinal Grade: ${naf.toFixed(2)}\n\n`
          );
        } else {
          console.log(
            `${name} AVG: ${average.toFixed(
              2
            )}\nAbsences: ${absence}\nSituation: ${situation}\nFinal Grade: 0\n\n`
          );
        }

        sheets.spreadsheets.values.update(
          {
            spreadsheetId,
            range: `G${rows.indexOf(row) + 4}`,
            valueInputOption: "RAW",
            resource: { values: [[situation]] },
          },
          (err, result) => {
            if (err) {
              console.log("Unable to Write to Spreadsheet", err);
            } else {
              console.log(
                `Changed Situation Changed - ${name} updated to: ${situation}`
              );
            }
          }
        );

        if(situation === "Prova Final"){
            sheets.spreadsheets.values.update(
                {
                spreadsheetId,
                range: `H${rows.indexOf(row) + 4}`,
                valueInputOption: "RAW",
                resource: { values: [[calculateNAF(average).toFixed(2)]] },
                },
                (err, result) => {
                if (err) {
                    console.log("Unable to Write to Spreadsheet", err);
                } else {
                    console.log(
                    `NAF from ${name} updated to: ${calculateNAF(average).toFixed(2)}`
                    );
                }
                }
            )
        } else {
            sheets.spreadsheets.values.update(
                {
                spreadsheetId,
                range: `H${rows.indexOf(row) + 4}`,
                valueInputOption: "RAW",
                resource: { values: [[0]] },
                },
                (err, result) => {
                if (err) {
                    console.log("Unable to Write to Spreadsheet", err);
                } else {
                    console.log(`NAF from ${name} updated to: 0`);
                }
                }
            )
        }

      });
    } else {
      console.log("No Data found");
    }
  }
);
