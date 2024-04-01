import checkDomainAvailability from "./checkDomainAvailability.js";

const domainsOutputEl = document.getElementById("domains");
const searchInputEl = document.getElementById("books");
const searchHelpEl = document.getElementById("search-help");

const getAutocomplete = async (awesomplete) => {
  searchHelpEl.innerHTML = "Searching...";
  const murl = `/search-gutenberg?query=${encodeURI(searchInputEl.value)}`;

  fetch(murl)
    .then((r) => r.json())
    .then((d) => {
      awesomplete.list = d.results.map((result) => ({
        // value: encodeURIComponent(`${result.title} ${result.authors.join(" ")}`),
        value: `${result.title}`,
        label: `${result.title} by ${result.authors.join(", ")}`,
      }));
      searchHelpEl.innerHTML = "";
    });
};

document.querySelector("body").addEventListener(
  "click",
  async (ev) => {
    if (ev.target.classList.contains("domain-check")) {
      ev.target.disabled = true;
      ev.target.classList.remove("domain-check");
      ev.target.innerHTML = "Checking...";
      const domain = ev.target.dataset.domain;
      const isDomainAvailable = await checkDomainAvailability(domain);

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
  const input = document.getElementById(elementId);
  const awesomplete = new Awesomplete(input, {
    minChars: 4,
    // maxItems: 8,
    autoFirst: true,
    filter: function (text, input) {
      return Awesomplete.FILTER_CONTAINS(text, input.match(/[^ ]*$/)[0]);
    },
    item: function (text, input) {
      return Awesomplete.ITEM(text, input.match(/[^ ]*$/)[0]);
    },
  });

  input.addEventListener("awesomplete-selectcomplete", async (ev) => {
    searchHelpEl.innerHTML = "Extracting domains...";
    const fullTitle = ev.text.label;
    const resp = await fetch(`/generate-domain-names?book=${fullTitle}`);
    const domains = await resp.json();
    if (domains?.length) {
      domainsOutputEl.innerHTML = /* html */ `
          <ul class="fs-5">
          ${domains
            .map(
              (domain) => /* html */ `
            <li class="mt-2 mb-2">
              <span class="font-monospace me-3" tabindex="0">${domain}</span>
              <button role="button" class="d-block d-md-inline btn btn-light domain-check p-1" data-domain="${domain}" tabindex="0">Check availability</button>
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
    searchHelpEl.innerHTML = "";
  });

  let debounce;

  input.addEventListener("keyup", (e) => {
    var code = e.keyCode || e.which;
    if (
      code === 37 ||
      code === 38 ||
      code === 39 ||
      code === 40 ||
      code === 27 ||
      code === 13
    ) {
      return;
    } else {
      clearTimeout(debounce);
      debounce = setTimeout(() => {
        getAutocomplete(awesomplete);
      }, 350);
    }
  });
};
