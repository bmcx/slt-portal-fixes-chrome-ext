// defines after how many seconds the script should run
const updateDelay = .5; 

// custom round method that removes zeros at the end of the number
Number.prototype.round = function (places) {
  return +(Math.round(this + "e+" + places) + "e-" + places);
};

// insert dom element after specified element within the same parent
function insertElementAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

// wrap content with html element + inline styles
function wrapEl(content, type) {
  switch (type) {
    case "bold":
      return `<span style="color:#ccc;font-weight:bold">${content}</span>`;

    case "disabled":
      return `<span style="color:#bbb;font-size:16px">${content}</span>`;

    default:
      return `<span style="color:#bbb;font-size:12px">${content}</span>`;
  }
}

/* parse the values from the large text after the progress indicator on the page
 * Ex: 32.4 GB USED OF 40.0 GB REMAINING
 * extracts 32.4 and 40.0 from above string
 * returns [32.4, 40.0]
 */
function parseValues(text) {
  const items = text.innerHTML?.split(" ");
  let a, b;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!isNaN(item)) {
      if (!a) a = item;
      else b = item;
    }
    if (a && b) break;
  }

  return [parseFloat(a), parseFloat(b)];
}

// update the package total slide content
function updatePackageTotal(slide, texts) {
  // only for package total
  if (slide?.innerHTML.includes("Total (Standard + Free)")) {
    // returns a string Total: 40GB(standard) + 60GB(free)
    function getBaseString(standard, free) {
      return `${standard}GB ${wrapEl("(standard)")} + ${free}GB ${wrapEl(
        "(free)"
      )}`;
    }

    const [stdUsed, stdTotal] = parseValues(texts[0]);
    const [totalUsed, packageSize] = parseValues(texts[1]);

    const totalRemaining = packageSize - totalUsed;

    const stdRemaining = (stdTotal - stdUsed).round(2);
    const freeRemaining = (totalRemaining - stdRemaining).round(2);
    const remainingEl = getBaseString(stdRemaining, freeRemaining);

    const freeTotal = (packageSize - stdTotal).round(2);
    const totalEl = getBaseString(stdTotal, freeTotal);

    const freeUsed = (totalUsed - stdUsed).round(2);
    const usedEl = getBaseString(stdUsed, freeUsed);

    const el =
      document.getElementById("dt-breakdown") ?? document.createElement("div");
    el.id = "dt-breakdown";
    el.innerHTML =
      wrapEl("Total: ", "bold") +
      `${totalEl}<br/>` +
      wrapEl("Used: ", "bold") +
      `${usedEl}<br/>` +
      wrapEl("Remaining: ", "bold") +
      `${remainingEl}`;
    insertElementAfter(el, slide);
  }
}

// update the text large text after the progress indicator
function updateText(element, remaining) {
  function appendRemaining(initial, append) {
    const str = initial.replace("USED OF", wrapEl("USED OF", "disabled"));
    if (str.includes("REMAINING")) {
      return str.replace(/^REMAINING \d.* GB$/, append);
    }
    return `${str} ${append}`;
  }

  if (!isNaN(remaining)) {
    // console.log(`Total: ${b}GB \nUsed : ${a}GB \n Remaining : (${remaining})`);
    element.innerHTML = appendRemaining(
      element.innerHTML,
      `${wrapEl("REMAINING", "disabled")} ${remaining.round(2)} GB`
    );
  }
}

// update the percentage inside the progress indicator
function changePercentage(element, remaining) {
  if (!isNaN(remaining)) {
    element.innerHTML = `${remaining.round(2)} GB`;
  }
}

// initialize the script
function main() {
  const text = document.getElementsByClassName("used-of");
  const percentage = document.getElementsByClassName("progress-count");
  const slides = document.querySelectorAll("li.slide > div > div > div.name");
  if (text && text.length > 0 && percentage && percentage.length > 0) {
    for (let i = 0; i < text.length; i++) {
      const [a, b] = parseValues(text[i]);
      const remaining = b - a;
      updateText(text[i], remaining);
      changePercentage(percentage[i], remaining);
      updatePackageTotal(slides[i], text);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  setInterval(main, updateDelay * 1000);
});
