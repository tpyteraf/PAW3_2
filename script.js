(function () {
  const btn1 = document.getElementById("btn1");
  const answer = document.getElementById("answer");

  btn1.addEventListener("click", function (e) {
    const targetUrl = "https://www.ncei.noaa.gov/cdo-web/api/v2/stations";
    const params = new URLSearchParams({
      key: "43e57cf2",
      url: targetUrl,
    });

    answer.innerHTML = "Loading...";
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
})();
