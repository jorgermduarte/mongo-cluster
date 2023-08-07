const shell = require('shelljs');
const { exec } = require('child_process');

const backupDir = './backups';
const dbName = 'mongo-primary';

function getCollections() {
    return new Promise((resolve, reject) => {
        exec(`mongo ${dbName} --eval "db.getCollectionNames().join('\\n')"`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            const collections = stdout.trim().split('\n');
            resolve(collections);
        });
    });
}

(async () => {
    try {
        const collections = await getCollections();

        // Cria um diretório de backup se não existir
        if (!shell.test('-d', backupDir)) {
            shell.mkdir(backupDir);
        }

        console.log(collections);

        // // Cria backups para todas as coleções
        // collections.forEach(collection => {
        //     const backupFileName = `${backupDir}/${collection}.bson`;
        //     const backupCommand = `mongodump --uri=mongodb://localhost:27017/${dbName} --collection=${collection} --out=${backupFileName}`;
        //     shell.exec(backupCommand);
        // });

        // // Comando para criar um arquivo tar.gz com os backups
        // shell.exec(`tar -zcf ${backupDir}.tar.gz ${backupDir}`);

        // // Comando para fazer o upload para o GitHub usando Personal Access Token
        // const githubAccessToken = 'SEU_PERSONAL_ACCESS_TOKEN';
        // const repoOwner = 'usuario';
        // const repoName = 'repositorio';
        // const commitMessage = 'Backup das coleções do MongoDB';
        // shell.exec(`curl -X POST -H "Authorization: token ${githubAccessToken}" -H "Content-Type: application/octet-stream" --data-binary @${backupDir}.tar.gz https://uploads.github.com/repos/${repoOwner}/${repoName}/releases/1/assets?name=${backupDir}.tar.gz`);

    } catch (error) {
        console.error('Error: ', error);
    }
})();
