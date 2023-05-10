const NUM_EXP = 100
import * as math from 'mathjs';
import { Tabulator } from 'tabulator-tables';
var tabledata = [];

function measureTime(funJS, funWASM, testName) {
  const times0 = []
  for (let i = 0; i < NUM_EXP; i++) {
    const t0 = performance.now()
    funJS()
    times0.push(performance.now() - t0)
  }
  const meanJS = math.mean(times0)
  const stdJS = math.std(times0)

  const times1 = []
  for (let i = 0; i < NUM_EXP; i++) {
    const t0 = performance.now()
    funWASM()
    times1.push(performance.now() - t0)
  }
  const meanWASM = math.mean(times1)
  const stdWASM = math.std(times1)

  tabledata.push({
    testName: testName,
    "JS (mean)": meanJS.toPrecision(4),
    "JS (std)": stdJS.toPrecision(4),
    "WASM (avg)": meanWASM.toPrecision(4),
    "WASM (std)": stdWASM.toPrecision(4)
  })
}

const rust = import('./pkg');

rust
  .then(perfTest => {
    measureTime(
      () => { Math.random() + Math.random() },
      () => { perfTest.add(Math.random(), Math.random()) },
      "Add 2 numbers"
    )

    // Call the sort function from js and webasm with a 100 array elements
    const a = Array.from({ length: 100 }, () => Math.floor(Math.random() * 1000));
    measureTime(
      () => { a.sort() },
      () => { perfTest.sort(a) },
      "Sort array of 100 int32"
    )

    // Call the sort function from js and webasm with a 100000 array elements
    const a1 = Array.from({ length: 100000 }, () => Math.floor(Math.random() * 100000));
    measureTime(
      () => { a1.sort() },
      () => { perfTest.sort(a1) },
      "Sort array of 100000 int32"
    )

    const a2 = Array.from({ length: 10000 }, () => {
      return {
        x: Math.floor(Math.random() * 100000),
        y: Math.floor(Math.random() * 100000)
      }
    });
    measureTime(
      () => { a2.sort() },
      () => { perfTest.sort_struct(a2) },
      "Sort array of 100000 samples"
    )

    var table = new Tabulator("#perf-table", {
      data: tabledata,
      autoColumns: true,
      layout: "fitColumns",
      responsiveLayout: "hide"
    });

  })
  .catch(console.error);