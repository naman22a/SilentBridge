import os
import shutil

image_folder = r'D:\Indian'
training_folder = r'model\data\training'
validation_folder = r'model\data\validation'

image_files = []
for root, dirs, files in os.walk(image_folder):
    for file in files:
        if file.endswith('.jpg'):
            image_files.append(os.path.join(root, file))

print(f"Found {len(image_files)} image files:")
print(image_files)

# Split the image files into training and validation sets
training_size = int(0.8 * len(image_files))
training_files = image_files[:training_size]
validation_files = image_files[training_size:]

# Create the training and validation folders if they don't exist
if not os.path.exists(training_folder):
    os.makedirs(training_folder)
if not os.path.exists(validation_folder):
    os.makedirs(validation_folder)

# Move the image files to the training and validation folders
for file in training_files:
    filename = os.path.basename(file)
    dst_path = os.path.join(training_folder, filename)
    shutil.move(file, dst_path)

for file in validation_files:
    filename = os.path.basename(file)
    dst_path = os.path.join(validation_folder, filename)
    shutil.move(file, dst_path)

print("Files moved successfully!")