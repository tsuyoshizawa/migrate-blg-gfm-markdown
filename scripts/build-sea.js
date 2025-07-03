const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const platform = process.platform;
const arch = process.arch;

// SEA設定ファイルを作成
const seaConfig = {
  main: 'dist/index.js',
  output: 'sea-prep.blob',
  disableExperimentalSEAWarning: true
};

// buildディレクトリを作成
if (!fs.existsSync('build')) {
  fs.mkdirSync('build');
}

// SEA設定ファイルを書き込み
fs.writeFileSync('sea-config.json', JSON.stringify(seaConfig, null, 2));

// GitHub Actionsのmatrix.targetに合わせてプラットフォーム名を調整
const getTargetName = () => {
  if (platform === 'win32') return 'win';
  if (platform === 'darwin') return 'macos';
  return platform;
};

const targetName = getTargetName();
const outputPath = `build/migrate-blg-gfm-${targetName}${platform === 'win32' ? '.exe' : ''}`;

try {
  console.log('Bundling with esbuild...');
  
  // esbuildでバンドル
  execSync('npx esbuild dist/index.js --bundle --platform=node --target=node22 --outfile=dist/bundle.js', { stdio: 'inherit' });
  
  // SEA設定を更新してバンドルファイルを使用
  seaConfig.main = 'dist/bundle.js';
  fs.writeFileSync('sea-config.json', JSON.stringify(seaConfig, null, 2));
  
  console.log('Creating SEA blob...');
  
  // SEA blobを生成
  execSync('node --experimental-sea-config sea-config.json', { stdio: 'inherit' });
  
  console.log('Copying Node.js binary...');
  
  // Node.jsバイナリをコピー
  const nodeBinary = process.execPath;
  fs.copyFileSync(nodeBinary, outputPath);
  
  console.log('Injecting SEA blob...');
  
  // SEA blobを注入
  if (platform === 'win32') {
    execSync(`npx postject "${outputPath}" NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2`, { stdio: 'inherit' });
  } else {
    execSync(`npx postject "${outputPath}" NODE_SEA_BLOB sea-prep.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA`, { stdio: 'inherit' });
  }
  
  // 実行権限を付与 (Unix系)
  if (platform !== 'win32') {
    fs.chmodSync(outputPath, '755');
  }
  
  // macOSでの追加処理
  if (platform === 'darwin') {
    console.log('Removing quarantine attribute (macOS)...');
    try {
      execSync(`xattr -d com.apple.quarantine "${outputPath}" 2>/dev/null || true`, { stdio: 'inherit' });
    } catch (error) {
      console.log('Note: Could not remove quarantine attribute (this is normal if not present)');
    }
    
    console.log('Signing binary for macOS...');
    try {
      execSync(`codesign --force --deep --sign - "${outputPath}"`, { stdio: 'inherit' });
    } catch (error) {
      console.log('Warning: Could not sign binary. This may cause security warnings on macOS.');
    }
  }
  
  console.log(`✅ SEA executable created: ${outputPath}`);
  
  // 一時ファイルを削除
  if (fs.existsSync('sea-config.json')) {
    fs.unlinkSync('sea-config.json');
  }
  if (fs.existsSync('sea-prep.blob')) {
    fs.unlinkSync('sea-prep.blob');
  }
  
} catch (error) {
  console.error('❌ SEA build failed:', error.message);
  
  // エラー時も一時ファイルを削除
  if (fs.existsSync('sea-config.json')) {
    fs.unlinkSync('sea-config.json');
  }
  if (fs.existsSync('sea-prep.blob')) {
    fs.unlinkSync('sea-prep.blob');
  }
  
  process.exit(1);
}
