const fs = require("node:fs")
const readline = require('node:readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const app = {}

// contoh script pembuatan folder
app.makeFolder = () => {
    rl.question("Masukan Nama Folder : ", (folderName) => {
        fs.mkdir(__dirname + `/${folderName}`, () => {
            console.log("success created new folder");
        });
        rl.close();
    });
};

// To Do : lanjutkan pembuatan logic disini 
// membuat file
app.makeFile = () => {
    rl.question("Masukan Nama Folder : ", (folder) => {
        rl.question("Masukan Nama File : ", (file) => {
            rl.question("Masukan Extension : ", (ext) => {
                fs.writeFileSync(`${folder}/${file}.${ext}`, "");
                rl.close();
            });
        });
    });
};

// merapikan folder
app.extSorter = () => {
    const res = fs.readdirSync("unorganize_folder");


    for (let i = 0; i < res.length; i++) {
        const element = res[i];
        const ext = element.split(".")[element.split(".").length - 1];
        if (["txt", "pdf", "md"].includes(ext)) {
            fs.mkdir(__dirname + `/text`, () => {
                console.log("success created new folder");
                fs.rename(
                    __dirname + `/unorganize_folder` + "/" + element, __dirname + `/text` + "/" + element, (err) => {}
                );
            });
        } else if (["jpg", "png"].includes(ext)) {
            fs.mkdir(__dirname + `/image`, () => {
                console.log("success created new folder");
                fs.rename(
                    __dirname + `/unorganize_folder` + "/" + element, __dirname + `/image` + "/" + element, (err) => {}
                );
            });
        } else {
            fs.mkdir(__dirname + `/undefined_type`, () => {
                console.log("success created new folder");
                fs.rename(
                    __dirname + `/unorganize_folder` + "/" + element, __dirname + `/undefined` + "/" + element, (err) => {}
                );
            });
        }
    }
    rl.close();
    return;
};

// membaca folder
app.readFolder = () => {
    rl.question("Masukan Nama Folder : ", (folderName) => {
        const res = fs.readdirSync(folderName);
        const output = [];

        for (let i = 0; i < res.length; i++) {
            const element = res[i];
            try {
                const stat = fs.statSync(__dirname + `/${folderName}` + "/" + element);
                const fileType = (() => {
                    const extension = element.split('.').pop().toLowerCase();
                    if (["jpg", "png"].includes(extension)) return "gambar";
                    if (extension === "txt") return "text";
                    if (extension === "md") return "markdown";
                    return "unknown";
                });
                output.push({
                    namaFile: element,
                    extensi: element.split('.')[1],
                    jenisFile: fileType(),
                    tanggalDibuat: stat.birthtime,
                    ukuranFile: `${(stat.size / 1024).toFixed(1)}kb`
                })
            } catch (error) {
                console.log("Gagal membaca file", folderName, element);
            }
        }
        console.log(output);
        rl.close();
    });
};

// membaca isi file
app.readFile = () => {
    rl.question("Masukkan Nama Folder : ", (folderName) => {
        rl.question("Masukkan Nama File : ", (fileName) => {
            const filePath = `./${folderName}/${fileName}`;
            const ext = fileName.split('.').pop().toLowerCase();

            if (["txt", "md"].includes(ext)) {
                fs.readFile(filePath, "utf8", (err, data) => {
                    if (err) {
                        console.error("Gagal membaca file:", err.message);
                    } else {
                        console.log(`Isi dari file ${fileName}:\n\n${data}`);
                    }
                    rl.close();
                });
            } else {
                console.log("File bukan teks.");
                rl.close();
            }
        });
    });
};

module.exports = app