const fs = require('fs');
const path = require('path');
const ftp = require('basic-ftp');
require('dotenv').config();

const EXCLUDED_NAMES = new Set([
    '.git',
    '.github',
    'node_modules',
    '.env',
    'deploy.js',
    'package.json',
    'package-lock.json',
    'README.md',
    '.gitignore'
]);

async function uploadFolder(client, localDir, remoteDir) {
    const items = fs.readdirSync(localDir);
    for (const item of items) {
        if (EXCLUDED_NAMES.has(item)) {
            continue;
        }
        const localPath = path.join(localDir, item);
        const remotePath = path.posix.join(remoteDir, item);
        const stat = fs.statSync(localPath);
        
        if (stat.isDirectory()) {
            console.log(`📂 Criando diretório remoto: ${remotePath}`);
            await client.ensureDir(remotePath);
            await uploadFolder(client, localPath, remotePath);
        } else {
            console.log(`🚀 Enviando: ${localPath} -> ${remotePath}`);
            await client.uploadFrom(localPath, remotePath);
        }
    }
}

async function main() {
    const client = new ftp.Client();
    client.ftp.verbose = false;
    
    const host = process.env.FTP_HOST || "ftp.ouricoedu.com.br";
    const user = process.env.FTP_USER || "u461658415";
    const password = process.env.FTP_PASS;
    const remoteRoot = "/domains/ouricoedu.com.br/public_html";
    
    if (!password) {
        console.error("❌ ERRO: A variável FTP_PASS não foi encontrada no arquivo .env.");
        process.exit(1);
    }
    
    try {
        console.log(`🔗 Conectando a ${host} como ${user}...`);
        await client.access({
            host,
            user,
            password,
            port: 21,
            secure: false
        });
        console.log("✅ Conectado com sucesso!");
        
        console.log(`📂 Acessando pasta de destino: ${remoteRoot}`);
        await client.ensureDir(remoteRoot);
        
        console.log("⬆️ Iniciando upload dos arquivos do site...");
        await uploadFolder(client, ".", remoteRoot);
        
        console.log("\n🎉 DEPLOY CONCLUÍDO COM SUCESSO!");
    } catch (err) {
        console.error("\n❌ Erro durante o deploy:", err.message);
    } finally {
        client.close();
    }
}

main();
