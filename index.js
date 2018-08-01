document.addEventListener("DOMContentLoaded", function(event) {
  const uploadButton = document.getElementById('upload')
  const convertButton = document.getElementById('convert')
  const fileInput = document.getElementById('file-upload')
  const sourceText = document.getElementById('source')
  const downloadButton = document.getElementById('download')
  const convertText = document.getElementById('converted')
  var filename = ''

  uploadButton.onclick = function (ev) {
    fileInput.click()
  }
  fileInput.onchange = function (ev) {
    const file =  ev.target.files[0]
    filename = ev.target.files[0].name.split('.')[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = function(e) {
        sourceText.innerText = e.target.result
      }
      reader.readAsText(file)
    }
  }
  convertButton.onclick = function (ev) {
    convertText.innerText = convert(sourceText.value)
  }

  downloadButton.onclick = function (ev) {
    let blob = new Blob([convertText.value], {type: 'text/csv'});
    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    } else {
      let elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = filename;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    // }
    }
  }
})

const convert = function (text) {
  // trim starting whitespace
  let result = text.replace(/^( )*/gm, '')
  // convert whitespace to csv divider
  result = result.replace(/( )\1{1,}/gm, ';')
  // remove header
  result = result.replace(/^(1RETENSI|LAPORAN|CABANG|NAMA|=|NO\.|SUB|TOTAL).*$/gm, '')
  // trim blank new line
  result = result.replace(/^\n/gm, '')
  // format amount
  result = result
    .split('\n')
    .map((rowValue) => {
      let columnSplit = rowValue.split(';')
      if (columnSplit.length > 1) {
        columnSplit[4] = columnSplit[4].replace(/(\,|\.00)/gm, '')
      }
      return columnSplit.join(';')
    })
    .join('\n')
  const prefix = 'No;NO.PELANGGAN/NO.TXN;Nama Pelanggan;;Nilai Transaksi;Tgl. TXN;Waktu;Lokasi;Keterangan 1;Keterangan 2\n'
  return prefix + result
}