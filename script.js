(function () {
  const btn1 = document.getElementById("btn1");
  const btn2 = document.getElementById("btn2");
  const btn3 = document.getElementById("btn3");
  const btn4 = document.getElementById("btn4");
  const btn5 = document.getElementById("btn5");
  const answer = document.getElementById("answer");

  async function stateByFIPS(fips) {
    const targetUrl =
      "https://www.ncei.noaa.gov/cdo-web/api/v2/locations/" + fips;
    const params = new URLSearchParams({
      key: "43e57cf2",
      url: targetUrl,
    });

    return await fetch("https://corsproxy.io/?" + params, {
      headers: {
        token: "SAUXnePztSKgSQLFdyAlZivCPUknxZzF",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          const json = await response.json();
          console.log("from stateByFips", json);
          return json.name;
        } else {
          const textError = await response.text();
          throw new Error(`Błąd serwera ${response.status}: ${textError}`);
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  btn1.addEventListener("click", function (e) {
    answer.innerHTML = "Pobieranie stacji...";
    const targetUrl = "https://www.ncei.noaa.gov/cdo-web/api/v2/stations";
    const params = new URLSearchParams({
      key: "43e57cf2",
      url: targetUrl,
    });

    fetch("https://corsproxy.io/?" + params, {
      headers: {
        token: "SAUXnePztSKgSQLFdyAlZivCPUknxZzF",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          const json = await response.json();
          console.log(json.results);

          const stations = Array.isArray(json.results)
            ? json.results
            : [json.results];

          if (stations.length === 0) {
            answer.innerHTML = "<p>Brak wyników dla podanego zapytania.</p>";
            return;
          }

          let tableHTML = `
            <table class="styled-table">
              <thead>
                <tr>
                  <th>Station ID</th>
                  <th>Name</th>
                  <th>Latitude</th>
                  <th>Longitude</th>
                </tr>
              </thead>
              <tbody>
          `;

          stations.forEach((station) => {
            const id = station?.id ?? "Brak danych";
            const name = station?.name ?? "Brak danych";
            const latitude = station?.latitude ?? "Brak danych";
            const longitude = station?.longitude ?? "Brak danych";

            tableHTML += `
              <tr>
                <td>${id}</td>
                <td>${name}</td>
                <td>${latitude}</td>
                <td>${longitude}</td>
              </tr>
            `;
          });

          tableHTML += `
              </tbody>
            </table>
          `;

          answer.innerHTML = tableHTML;
        } else {
          const textError = await response.text();
          throw new Error(`Błąd serwera ${response.status}: ${textError}`);
        }
      })
      .catch((error) => {
        answer.innerHTML =
          "<p style='color: red;'>Wystąpił błąd podczas pobierania danych.</p>";
        console.error(error.message);
      });
  });

  btn2.addEventListener("click", function (e) {
    answer.innerHTML = "Pobieranie lokalizacji...";
    const targetUrl = "https://www.ncei.noaa.gov/cdo-web/api/v2/locations";
    const params = new URLSearchParams({
      key: "43e57cf2",
      url: targetUrl,
    });

    fetch("https://corsproxy.io/?" + params, {
      headers: {
        token: "SAUXnePztSKgSQLFdyAlZivCPUknxZzF",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          const json = await response.json();
          console.log(json.results);

          const locations = Array.isArray(json.results)
            ? json.results
            : [json.results];

          if (locations.length === 0) {
            answer.innerHTML = "<p>Brak wyników dla podanego zapytania.</p>";
            return;
          }

          let tableHTML = `
            <table class="styled-table">
              <thead>
                <tr>
                  <th>Location ID</th>
                  <th>Name</th>
                  <th>Data coverage</th>
                </tr>
              </thead>
              <tbody>
          `;

          locations.forEach((location) => {
            const id = location?.id ?? "Brak danych";
            const name = location?.name ?? "Brak danych";
            const dc = location?.datacoverage ?? "Brak danych";

            tableHTML += `
              <tr>
                <td>${id}</td>
                <td>${name}</td>
                <td>${dc}</td>
              </tr>
            `;
          });

          tableHTML += `
              </tbody>
            </table>
          `;

          answer.innerHTML = tableHTML;
        } else {
          const textError = await response.text();
          throw new Error(`Błąd serwera ${response.status}: ${textError}`);
        }
      })
      .catch((error) => {
        answer.innerHTML =
          "<p style='color: red;'>Wystąpił błąd podczas pobierania danych.</p>";
        console.error(error.message);
      });
  });

  btn3.addEventListener("click", function (e) {
    answer.innerHTML = "Pobieranie danych klimatycznych...";

    const params = new URLSearchParams({
      datasetid: "GHCND",
      locationid: "ZIP:28801",
      startdate: "2010-05-01",
      enddate: "2010-05-01",
    });

    const targetUrl = `https://www.ncei.noaa.gov/cdo-web/api/v2/data?${params.toString()}`;

    const params2 = new URLSearchParams({
      key: "43e57cf2",
      url: targetUrl,
    });

    fetch("https://corsproxy.io/?" + params2, {
      headers: {
        token: "SAUXnePztSKgSQLFdyAlZivCPUknxZzF",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          const json = await response.json();
          const weatherData = json.results || [];

          if (weatherData.length === 0) {
            answer.innerHTML = "<p>Brak wyników dla podanych parametrów.</p>";
            return;
          }

          let tableHTML = `
            <table class="styled-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Stacja</th>
                  <th>Typ pomiaru (Datatype)</th>
                  <th>Wartość</th>
                </tr>
              </thead>
              <tbody>
          `;

          weatherData.forEach((dataPoint) => {
            const date = dataPoint?.date
              ? dataPoint.date.split("T")[0]
              : "Brak";
            const station = dataPoint?.station ?? "Brak";
            const datatype = dataPoint?.datatype ?? "Brak";
            const value = dataPoint?.value ?? "Brak";

            tableHTML += `
              <tr>
                <td>${date}</td>
                <td>${station}</td>
                <td>${datatype}</td>
                <td>${value}</td>
              </tr>
            `;
          });

          tableHTML += `
              </tbody>
            </table>
          `;

          answer.innerHTML = tableHTML;
        } else {
          const textError = await response.text();
          throw new Error(`Błąd serwera ${response.status}: ${textError}`);
        }
      })
      .catch((error) => {
        answer.innerHTML =
          "<p style='color: red;'>Wystąpił błąd podczas pobierania danych.</p>";
        console.error(error.message);
      });
  });

  btn4.addEventListener("click", function (e) {
    const STATE_TO_FIPS = {
      AL: "01",
      AK: "02",
      AZ: "04",
      AR: "05",
      CA: "06",
      CO: "08",
      CT: "09",
      DE: "10",
      DC: "11",
      FL: "12",
      GA: "13",
      HI: "15",
      ID: "16",
      IL: "17",
      IN: "18",
      IA: "19",
      KS: "20",
      KY: "21",
      LA: "22",
      ME: "23",
      MD: "24",
      MA: "25",
      MI: "26",
      MN: "27",
      MS: "28",
      MO: "29",
      MT: "30",
      NE: "31",
      NV: "32",
      NH: "33",
      NJ: "34",
      NM: "35",
      NY: "36",
      NC: "37",
      ND: "38",
      OH: "39",
      OK: "40",
      OR: "41",
      PA: "42",
      RI: "44",
      SC: "45",
      SD: "46",
      TN: "47",
      TX: "48",
      UT: "49",
      VT: "50",
      VA: "51",
      WA: "53",
      WV: "54",
      WI: "55",
      WY: "56",
    };
    answer.innerHTML = "Pobieranie stacji...";
    const inp1 = document.getElementById("inp1").value.trim();

    if (!STATE_TO_FIPS.hasOwnProperty(inp1.toUpperCase())) {
      answer.innerHTML =
        "<p style='color: red;'>Niepoprawny kod stanu. Użyj dwuliterowego kodu stanu USA (np. CA, TX, NY).</p>";
      return;
    }

    const params = new URLSearchParams({
      locationid: `FIPS:${STATE_TO_FIPS[inp1.toUpperCase()]}`,
      limit: "100",
    });
    const targetUrl =
      "https://www.ncei.noaa.gov/cdo-web/api/v2/stations?" + params.toString();

    const params2 = new URLSearchParams({
      key: "43e57cf2",
      url: targetUrl,
    });

    fetch("https://corsproxy.io/?" + params2.toString(), {
      headers: {
        token: "SAUXnePztSKgSQLFdyAlZivCPUknxZzF",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          const json = await response.json();
          console.log(json.results);

          const stations = Array.isArray(json.results)
            ? json.results
            : [json.results];

          if (stations.length === 0) {
            answer.innerHTML = "<p>Brak wyników dla podanego zapytania.</p>";
            return;
          }

          let tableHTML = `
            <table class="styled-table">
              <thead>
                <tr>
                  <th>Station ID</th>
                  <th>Name</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
          `;

          const state = await stateByFIPS(
            "FIPS:" + STATE_TO_FIPS[inp1.toUpperCase()],
          );
          stations.forEach((station) => {
            const id = station?.id ?? "Brak danych";
            const name = station?.name ?? "Brak danych";

            tableHTML += `
              <tr>
                <td>${id}</td>
                <td>${name}</td>
                <td>${state}</td>
              </tr>
            `;
          });

          tableHTML += `
              </tbody>
            </table>
          `;

          answer.innerHTML = tableHTML;
        } else {
          const textError = await response.text();
          throw new Error(`Błąd serwera ${response.status}: ${textError}`);
        }
      })
      .catch((error) => {
        answer.innerHTML =
          "<p style='color: red;'>Wystąpił błąd podczas pobierania danych.</p>";
        console.error(error.message);
      });
  });

  btn5.addEventListener("click", function (e) {
    answer.innerHTML = "Pobieranie danych klimatycznych...";

    // const params = new URLSearchParams({
    //   datasetid: "GHCND",
    //   startdate: "1900-01-01",
    //   enddate: "2030-01-01",
    // });

    const targetUrl = `https://www.ncei.noaa.gov/cdo-web/api/v2/datasets`;

    const params2 = new URLSearchParams({
      key: "43e57cf2",
      url: targetUrl,
      limit: "100",
    });

    fetch("https://corsproxy.io/?" + params2, {
      headers: {
        token: "SAUXnePztSKgSQLFdyAlZivCPUknxZzF",
      },
    })
      .then(async (response) => {
        if (response.ok) {
          const json = await response.json();
          const datasets = json.results || [];

          if (datasets.length === 0) {
            answer.innerHTML = "<p>Brak wyników dla podanych parametrów.</p>";
            return;
          }

          let tableHTML = `
            <table class="styled-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mindate</th>
                  <th>Maxdate</th>
                </tr>
              </thead>
              <tbody>
          `;

          datasets.forEach((set) => {
            const name = set?.name ?? "Brak";
            const mindate = set?.mindate ?? "Brak";
            const maxdate = set?.maxdate ?? "Brak";

            tableHTML += `
              <tr>
                <td>${name}</td>
                <td>${mindate}</td>
                <td>${maxdate}</td>
              </tr>
            `;
          });

          tableHTML += `
              </tbody>
            </table>
          `;

          answer.innerHTML = tableHTML;

          const countByDecade = {};
          datasets.forEach((set) => {
            const year = Number(set.mindate.slice(0, 4));
            const decade = Math.floor(year / 10) * 10;
            countByDecade[decade] = (countByDecade[decade] || 0) + 1;
          });

          const sortedDecades = Object.keys(countByDecade)
            .map(Number)
            .sort((a, b) => a - b);

          new Chart(document.getElementById("decadeChart"), {
            type: "bar",
            data: {
              labels: sortedDecades,
              datasets: [
                {
                  label: "Liczba zbiorów danych według dekady",
                  data: sortedDecades.map((decade) => countByDecade[decade]),
                  backgroundColor: "rgba(75, 192, 192, 0.7)",
                  borderColor: "rgba(75, 192, 192, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              scales: {
                y: {
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            },
          });
        } else {
          const textError = await response.text();
          throw new Error(`Błąd serwera ${response.status}: ${textError}`);
        }
      })
      .catch((error) => {
        answer.innerHTML =
          "<p style='color: red;'>Wystąpił błąd podczas pobierania danych.</p>";
        console.error(error.message);
      });
  });
})();
