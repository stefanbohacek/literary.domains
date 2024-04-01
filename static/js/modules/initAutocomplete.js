import checkDomainAvailability from "./checkDomainAvailability.js";

const domainsOutputEl = document.getElementById("domains");

document.querySelector("body").addEventListener(
  "click",
  async (ev) => {
    if (ev.target.classList.contains("domain-check")) {
      ev.target.disabled = true;
      ev.target.classList.remove("domain-check");
      ev.target.innerHTML = "Checking...";
      const domain = ev.target.dataset.domain;
      const isDomainAvailable = await checkDomainAvailability(domain);
      console.log("isDomainAvailable", domain, isDomainAvailable);

      if (isDomainAvailable) {
        ev.target.innerHTML = "Available";
        ev.target.classList.add("text-success");
      } else {
        ev.target.innerHTML = "Not available";
        ev.target.classList.add("text-danger");
      }
    }
  },
  true
);

export default (elementId) => {
  new Autocomplete(elementId, {
    clearButton: false,
    onSearch: ({ currentValue }) => {
      const api = `/search-gutenberg?query=${encodeURI(currentValue)}`;

      return new Promise((resolve) => {
        fetch(api)
          .then((response) => response.json())
          .then((data) => {
            resolve(data);
          })
          .catch((error) => {
            console.error(error);
          });
      });
    },
    onResults: ({ matches }) => {
      return matches.results
        .map((el) => {
          return /* html */ `
            <li data-full-title="${encodeURIComponent(
              el.title + " " + el.authors.join(" ")
            )}">
              <strong>${el.title}</strong> by ${el.authors.join(", ")}
            </li>
          `;
        })
        .join("");
    },
    onSubmit: async ({ index, element, object, results }) => {
      domainsOutputEl.innerHTML = "Searching text for domain names...";

      const fullTitle =
        results.getElementsByTagName("li")[index].dataset.fullTitle;
      const resp = await fetch(`/generate-domain-names?book=${fullTitle}`);
      const domains = await resp.json();

      console.log("domains", domains);

      if (domains?.length) {
        domainsOutputEl.innerHTML = /* html */ `
          <ul class="fs-5">
          ${domains
            .map(
              (domain) => /* html */ `
            <li class="mt-2 mb-2">
              <span class="font-monospace me-3" tabindex="0">${domain}</span>
              <button role="button" class="btn btn-light domain-check p-1" data-domain="${domain}" tabindex="0">Check availability</button>
            </li>
          `
            )
            .join("")}
          </ul>
        `;
      } else {
        domainsOutputEl.innerHTML =
          "No domain names found, please try another book.";
      }
    },
  });
};
