from pathlib import Path
import shutil

top_level_paths = [
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\src\images\maps\overworld\tiles\zoom.0"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\src\images\maps\overworld\tiles\zoom.-1"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\src\images\maps\overworld\tiles\zoom.-2"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\src\images\maps\overworld\tiles\zoom.-3"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\src\images\maps\overworld\tiles\zoom.-4"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\src\images\maps\overworld\tiles\zoom.-5"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\src\images\maps\overworld\tiles\zoom.-6")
]

def move_png_files(top_level_dir: Path):
    # Walk through the directory tree
    for path in top_level_dir.rglob('*.png'):
        if path.is_file():
            destination = top_level_dir / path.name
            shutil.move(str(path), str(destination))
    print(f"{top_level_dir.name} finished")

def move_all_png_files():
    for top_dir in top_level_paths:
        move_png_files(top_dir)
    print("Remember to delete folders and metadata.")

if __name__ == "__main__":
    move_all_png_files()