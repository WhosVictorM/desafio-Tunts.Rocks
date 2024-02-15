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

function calculateNAF(average, situation) {
  if (situation === "Prova Final") {
    return (100 - average).toFixed(2);
  } else {
    return 0;
  }
}

async function main() {
  const auth = new google.auth.GoogleAuth({
    keyFile:
      "C://Users//victo//Desktop//Development//Vscode/TuntsRocks/credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const spreadsheetId = "1GNw9IFnNXapd8FcOzcuC11aYLUjQxOmqf4tLT8hkNyo";
  const range = "A4:F27";

  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = res.data.values;

    if (rows.length) {
      console.log("Grades: \n");
      for (let row of rows) {
        const name = row[1];
        const absence = parseInt(row[2]);
        const p1 = parseFloat(row[3]);
        const p2 = parseFloat(row[4]);
        const p3 = parseFloat(row[5]);
        const average = (p1 + p2 + p3) / 3;
        const situation = situationCheck(average, absence);

        const naf = calculateNAF(average, situation);

        console.log(
          `${name} AVG: ${average.toFixed(
            2
          )}\nAbsences: ${absence}\nSituation: ${situation}\nFinal Grade: ${naf}\n\n`
        );

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `G${rows.indexOf(row) + 4}`,
          valueInputOption: "RAW",
          resource: { values: [[situation]] },
        });

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `H${rows.indexOf(row) + 4}`,
          valueInputOption: "RAW",
          resource: { values: [[naf]] },
        });
      }
    } else {
      console.log("No Data found");
    }
  } catch (err) {
    console.log("Spreadsheet not found", err);
  }
}

main();
