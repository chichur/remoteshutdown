# -*- mode: python ; coding: utf-8 -*-


block_cipher = None


app = Analysis(['app.py'],
             pathex=[],
             binaries=[],
             datas=[],
             hiddenimports=[],
             hookspath=[],
             hooksconfig={},
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
app_pyz = PYZ(app.pure, app.zipped_data,
             cipher=block_cipher)

app_exe = EXE(app_pyz,
          app.scripts,
          [],
          exclude_binaries=True,
          name='app',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          console=True,
          disable_windowed_traceback=False,
          target_arch=None,
          codesign_identity=None,
          entitlements_file=None )

auto = Analysis(['auto.py'],
             pathex=[],
             binaries=[],
             datas=[],
             hiddenimports=[],
             hookspath=[],
             hooksconfig={},
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
auto_pyz = PYZ(auto.pure, auto.zipped_data,
             cipher=block_cipher)

auto_exe = EXE(auto_pyz,
          auto.scripts,
          [],
          exclude_binaries=True,
          name='auto',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          console=False,
          disable_windowed_traceback=False,
          target_arch=None,
          codesign_identity=None,
          entitlements_file=None )

coll = COLLECT(app_exe,
               app.binaries,
               app.zipfiles,
               app.datas,
               auto_exe,
               auto.binaries,
               auto.zipfiles,
               auto.datas,
               strip=False,
               upx=True,
               upx_exclude=[],
               name='app')
