hold off;
wd = cd;
addpath(genpath([wd '/allfns']));
[w, h]   = deal(5184, 3456);
outputView = imref2d([h,w]);
%%
absH = 160;
%im_o = imread('data/IMG_6708.jpg');
%im_t = imread('data/IMG_6710.jpg');
%im_ref = imread('data/IMG_6712.jpg');

%im = imread('data/IMG_6708.jpg');
im = imread('data/img/2/1.jpg');
%im = imread('data/IMG_6712.jpg');
%im = imread('data/test.jpg');

%im = imread('data/a2.jpeg');
%binImage = rgb2gray(im);

%% edge detection
%Canny is the best, then Prewitt, Sobel, Roberts
%eim = edge(binImage,'Sobel');
imshow(im);
hold on;
%% test
for i = 1 : 2
    [X(i), Y(i)]= ginput(1);
    points(i, :) = [X(i), Y(i)];
    plot(X(i), Y(i), 'g+');
end
% line(points(:, 1),points(:, 2),'linewidth', 3);

relH = norm(points(2, :) - points(1, :));%top-bottom
tempH = absH / relH;

for i = 1 : 2
    [X(i), Y(i)]= ginput(1);
    points(i, :) = [X(i), Y(i)];
    plot(X(i), Y(i), 'r+');
end
% line(points(:, 1),points(:, 2),'linewidth', 3);
temp = norm(points(2, :) - points(1, :));%top-bottom
res = temp * tempH;
disp([res]);