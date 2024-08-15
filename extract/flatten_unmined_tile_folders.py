from pathlib import Path
import shutil
import subprocess

top_level_paths = [
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\overworld\tiles\zoom.2"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\overworld\tiles\zoom.1"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\overworld\tiles\zoom.0"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\overworld\tiles\zoom.-1"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\overworld\tiles\zoom.-2"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\overworld\tiles\zoom.-3"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\overworld\tiles\zoom.-4"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\overworld\tiles\zoom.-5"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\overworld\tiles\zoom.-6")
]

top_level_paths_end = [
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\end\tiles\zoom.2"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\end\tiles\zoom.1"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\end\tiles\zoom.0"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\end\tiles\zoom.-1"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\end\tiles\zoom.-2"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\end\tiles\zoom.-3")
]

top_level_paths_true_end = [
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\true_end\tiles\zoom.2"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\true_end\tiles\zoom.1"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\true_end\tiles\zoom.0"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\true_end\tiles\zoom.-1"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\true_end\tiles\zoom.-2"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\true_end\tiles\zoom.-3"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\true_end\tiles\zoom.-4"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\true_end\tiles\zoom.-5"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\true_end\tiles\zoom.-6")
]

top_level_paths_lodahr = [
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\lodahr\tiles\zoom.2"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\lodahr\tiles\zoom.1"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\lodahr\tiles\zoom.0"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\lodahr\tiles\zoom.-1"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\lodahr\tiles\zoom.-2"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\lodahr\tiles\zoom.-3"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\lodahr\tiles\zoom.-4"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\lodahr\tiles\zoom.-5"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\lodahr\tiles\zoom.-6")
]

top_level_paths_space = [
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\space\tiles\zoom.2"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\space\tiles\zoom.1"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\space\tiles\zoom.0"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\space\tiles\zoom.-1"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\space\tiles\zoom.-2"),
    Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\space\tiles\zoom.-3")
]

def move_png_files(top_level_dir: Path):
    # Walk through the directory tree
    for path in top_level_dir.rglob('*.png'):
        if path.is_file():
            destination = top_level_dir / path.name
            shutil.move(str(path), str(destination))
    print(f"{top_level_dir.name} finished")

def move_all_png_files(path_list):
    for top_dir in path_list:
        move_png_files(top_dir)
    print("Remember to delete folders and metadata.")


def optimize_pngs(path: Path):
    oxi_png_path = Path(__file__).parents[1] / "tools/oxipng-9.1.2-x86_64-pc-windows-msvc/oxipng.exe"
    if not oxi_png_path.exists():
        print("oxipng not found")
        return
    
    command = f"{oxi_png_path} -o 3 --alpha --recursive {path}"
    subprocess.run(command, capture_output=True)


if __name__ == "__main__":
    # move_all_png_files(top_level_paths)
    # optimize_pngs(Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\end\tiles"))
    # optimize_pngs(Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\space\tiles"))
    # optimize_pngs(Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\true_end\tiles"))
    # optimize_pngs(Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\lodahr\tiles"))
    # optimize_pngs(Path(r"C:\Users\Zachary\Coding\VSCode\DrehmalMap\images\maps\overworld\tiles"))
    pass