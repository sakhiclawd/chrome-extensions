import zipfile
import os

def zip_directory(folder_path, output_path):
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(folder_path):
            if 'dist' in dirs:
                dirs.remove('dist')
            if '.git' in dirs:
                dirs.remove('.git')
            for file in files:
                if file.endswith('.zip') or file.endswith('.tar.gz'):
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, folder_path)
                zipf.write(file_path, arcname)

if __name__ == "__main__":
    zip_directory('Chrome-Extensions/extensions/briefly-ai', 'Chrome-Extensions/extensions/briefly-ai/dist/v1.0.0-stable.zip')
    print("Successfully created v1.0.0-stable.zip")
