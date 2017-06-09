
version="$(wget -q -O - http://sourceforge.net/projects/opencvlibrary/files/opencv-unix | egrep -m1 -o '\"[0-9](\.[0-9]+)+' | cut -c2-)"
echo "Installing OpenCV" $version

cd opencv-$version
mkdir build
cd build

echo "*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_*_"

cmake -D CMAKE_BUILD_TYPE=RELEASE \
	-D CMAKE_INSTALL_PREFIX=/usr/local \
	-D WITH_TBB=ON \
	-D BUILD_NEW_PYTHON_SUPPORT=ON \
	-D WITH_V4L=ON \
  	-D BUILD_opencv_java=ON \
	-D INSTALL_C_EXAMPLES=ON \
	-D INSTALL_PYTHON_EXAMPLES=ON \
	-D BUILD_DOCS=ON \
	-D BUILD_EXAMPLES=ON \
	-D WITH_QT=ON \
	-D WITH_OPENGL=ON \
	-D WITH_EIGEN=ON ..

make -j4

echo "***********************************"

sudo make install

echo "***********************************"

sudo sh -c 'echo "/usr/local/lib" > /etc/ld.so.conf.d/opencv.conf'

echo "***********************************"

sudo ldconfig

echo "OpenCV" $version "ready to be used"
