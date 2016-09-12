function a = calculation(path_front, path_side, absH, rheight_front, rheight_side, rtoe_side, rwaist_front, rwaist_side, rchest_front, rchest_side_midpoint)
display(absH);
display(path_front);
display(path_side);
display(rheight_front);
display(rheight_side);
display(rtoe_side);
display(rwaist_front);
display(rwaist_side);
display(rchest_front);
display(rchest_side_midpoint);
img = imread(path_front);
figure;
imshow(img);
hold on;
plot(rtoe_side(1,1),rtoe_side(1,2),'r+');
a = rheight_front;
end
