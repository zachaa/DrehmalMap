from pathlib import Path
from PIL import Image


PATH_INPUT_IMAGES = Path(r"../data_raw/all inventory icon 1.21/1-21-MinecraftAllItemImagesV1/Transparent-Images")
PATH_RESIZE_IMAGES = Path(r"../data_raw/all inventory icon 1.21/resized_images_32x")
PATH_OUTPUT_IMAGES = Path(r"../images/icons")


def create_list_of_already_existing_images(file_path: Path) -> list[str]:
    image_list = [image_file.stem for image_file in file_path.glob("*.png")]
    return image_list


def create_list_of_already_existing_images(file_path: Path):
    # List comprehension to find all .png files and remove the extension
    image_list = [file.stem for file in file_path.glob("*.png")]
    return image_list


def resize_images(input_dir: Path, output_dir: Path, image_list):
    # Ensure the output directory exists
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Loop through all PNG files in the input directory
    for img_path in input_dir.glob("*.png"):
        img_name = img_path.stem
        
        # Skip images that are in the image_list
        if img_name in image_list:
            continue
        
        with Image.open(img_path) as img:
            # Resize the image to 32x32
            resized_img = img.resize((32, 32), Image.Resampling.LANCZOS)
            resized_img.save(output_dir / f"{img_name}.png", optimize=True)


if __name__ == "__main__":
    print(PATH_INPUT_IMAGES.exists(), PATH_RESIZE_IMAGES.exists(), PATH_INPUT_IMAGES.exists())
    LIST_already_existing_images = create_list_of_already_existing_images(PATH_OUTPUT_IMAGES)
    print("Image count:", len(LIST_already_existing_images))
    resize_images(PATH_INPUT_IMAGES, PATH_OUTPUT_IMAGES, LIST_already_existing_images)
    print("Done")