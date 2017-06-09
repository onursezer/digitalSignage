import numpy as np
import cv2
import requests
import json
import time

url = "http://localhost:6060/pyt"

#Load the template and initialize the webcam
#HOG Algorithm
hog = cv2.HOGDescriptor()
hog.setSVMDetector( cv2.HOGDescriptor_getDefaultPeopleDetector() )
cap = cv2.VideoCapture("pedestrians.mp4")
# variables 
c_punt=[244,0,0]
n_peatons=0


headers = {'Content-type': 'application/json', 'Accept': 'text/plain'}


while(True):
    x1=0;
    y1=0;
    
    #We read a frame and keep it.
    ret,img1 = cap.read()
    #turn the image
    img = cv2.flip(img1,1)
    #We convert the image to black and white
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
 
    #We look for the coordinates if there is one and we keep their position
    
    found,x=hog.detectMultiScale(gray, winStride=(8,8), padding=(32,32), scale=1.09)
     
    #A rectangle is drawn in the coordinates of each person
    for (x,y,w,h) in found:
        cv2.rectangle(img,(x,y),(x+w,y+h),(125,255,0),2)
    
    #Number of pedestrians
    size = len(found);
    ################
    data = {'sender': 'GTU', 'count': size, 'message': 'Number of Detect Pedestrain'}
    r = requests.post(url, data=json.dumps(data), headers=headers)
    ################
    cv2.putText(img,str(size), (350,40), cv2.FONT_HERSHEY_TRIPLEX, 1,(0,0,255),2)
    cv2.putText(img,str('Detect Person :'), (50,40), cv2.FONT_HERSHEY_TRIPLEX, 1,(0,0,255),2)
   #Name of the window
    cv2.imshow('Kamera',img)
   #With the 'x' key we exit the program
    
    if cv2.waitKey(1) & 0xFF == ord('x'):
        break
   
cap.release()
cv2.destroyAllWindows()