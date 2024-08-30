# Import libraries as required

from keras._tf_keras.keras.preprocessing.image import ImageDataGenerator
import numpy as np
import cv2 as cv
import os
import tensorflow as tf
import matplotlib.pyplot as plt
from keras import layers, models
TF_ENABLE_ONEDNN_OPTS=0



# Data Import and Handling

train = ImageDataGenerator(rescale=1/255,
                            rotation_range=45,
                            width_shift_range=.15,
                            height_shift_range=.15,
                            horizontal_flip=True,
                            zoom_range=0.5)
validation = ImageDataGenerator(rescale=1/255,
                                rotation_range=45,
                                width_shift_range=.15,
                                height_shift_range=.15,
                                horizontal_flip=True,
                                zoom_range=0.5)

train_dataset = train.flow_from_directory('model/data/training/',
                                          target_size=(100,100))
validation_dataset = validation.flow_from_directory('model/data/validation',
                                                    target_size=(100,100))




# Import Model
model = models.Sequential()
model.add(layers.Conv2D(32, (3,3), activation='relu'))
model.add(layers.MaxPooling2D((2,2)))
model.add(layers.Conv2D(64, (3,3), activation='relu'))
model.add(layers.MaxPooling2D((2,2)))
model.add(layers.Conv2D(64, (3,3), activation='relu'))
model.add(layers.Flatten())
model.add(layers.Dense(64, activation='relu'))
model.add(layers.Dense(35, activation='softmax'))

model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])


##Fit the Model
model.fit(train_dataset,
          steps_per_epoch=5,
          epochs=200,
          validation_data=validation_dataset)

# Save the model
model.save('model_isl.h5')