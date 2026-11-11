(function () {
  const btn1 = document.getElementById("btn1");
  const btn2 = document.getElementById("btn2");
  const btn3 = document.getElementById("btn3");
  const answer = document.getElementById("answer");

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
})();
