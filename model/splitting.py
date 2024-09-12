import os
import shutil
import random

# Set the root directory to the full path of the 'Indian' folder
root_dir = r'D:\Indian'

# Set the training and validation directories
train_dir = os.path.join(root_dir, r'D:\SilentBridge\model\data\training')
val_dir = os.path.join(root_dir, r'D:\SilentBridge\model\data\validation')

# Get a list of all subfolders within the 'Indian' folder
classes = [subfolder for subfolder in os.listdir(root_dir) if os.path.isdir(os.path.join(root_dir, subfolder)) and subfolder not in ['training', 'validation']]

# Create subfolders for each class in the 'training' and 'validation' folders
for class_name in classes:
    train_subdir = os.path.join(train_dir, class_name)
    val_subdir = os.path.join(val_dir, class_name)
    os.makedirs(train_subdir, exist_ok=True)
    os.makedirs(val_subdir, exist_ok=True)

# Split the images within each subfolder into training and validation sets
for class_name in classes:
    class_dir = os.path.join(root_dir, class_name)
    image_files = [f for f in os.listdir(class_dir) if f.endswith('.jpg')]
    random.shuffle(image_files)
    split_index = int(0.8 * len(image_files))
    train_files = image_files[:split_index]
    val_files = image_files[split_index:]

    for file in train_files:
        src = os.path.join(class_dir, file)
        dst = os.path.join(train_dir, class_name, file)
        shutil.copy(src, dst)

    for file in val_files:
        src = os.path.join(class_dir, file)
        dst = os.path.join(val_dir, class_name, file)
        shutil.copy(src, dst)