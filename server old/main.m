function result = main(path_front, path_side, absH, rheight_front, rheight_side, rtoe_side, rwaist_front, rwaist_side, rchest_front, rchest_side_midpoint)
    %% init
    %path_frontView = 'data/img/1/1.jpg';
    %path_sideView = 'data/img/1/2.jpg';
    %absH = 177;
%      display(absH);
%     display(path_front);
%     display(path_side);
%     display(rheight_front);
%     display(rheight_side);
%     display(rtoe_side);
%     display(rwaist_front);
%     display(rwaist_side);
%     display(rchest_front);
%     display(rchest_side_midpoint);
    
    findChest_front = 1;
    findWaist_front = 1;
    findShoulder_front = -1;
    findChest_side = -1;
    findWaist_side = 1;
    findShoulder_side = -1;
    path_frontView = path_front;
    path_sideView = path_side;
    setting_front = [findChest_front, findWaist_front, findShoulder_front];
    setting_side = [findChest_side, findWaist_side, findShoulder_side];

    %% front view
    %frontView(path, absH, findChest, findWaist, findShoulder) 
    %0 = mannually, 1 = automatically, -1 = ignore
    front = frontView(path_frontView, setting_front, absH, rheight_front, rwaist_front, rchest_front);

    %% side view
    %sideways = sideView(path, absH, findChest, findWaist, findShoulder)
    %0 = mannually, 1 = automatically, -1 = ignore
    sideways = sideView(path_sideView, setting_side, absH, rheight_side, rwaist_side, rtoe_side, rchest_side_midpoint);
    angle = sideways.angle;

    %% waistline size
    relW_front = norm(front.rightWaist - front.leftWaist);
    waist_front = relW_front * front.tempH;

    %% chest size
    relC_front = norm(front.rightChest - front.leftChest);
    chest_front = relC_front * front.tempH;

    %relC_sideways = norm(sideways.rightChest - sideways.leftChest);
    %chest_sideways = relC_sideways * sideways.tempH;

    %% waistline 
    hold off;
%     im = imread(path_frontView);
%     figure;
%     imshow(im);
%     hold on;

    joint_front = front.rm;
    joint_sideways = sideways.rm;

    chest_tform = fitgeotrans(joint_sideways, joint_front, 'projective'); % rotation matrix
    chest_r = transformPointsForward(chest_tform, joint_sideways);
    plot(front.chestMidpoint(:,1), front.chestMidpoint(:,2),'r+')
    plot(chest_r(5,1), chest_r(5,2), 'yo');
    chest_temp = norm(front.chestMidpoint - chest_r(5,:)) * front.tempH;

    %% Waist
    transfer = fitgeotrans(joint_front, joint_sideways, 'projective');
    objective = transformPointsForward(transfer, joint_front);

    ori = front.rm(3:4,:);
    obj = objective(3:4,:);
    slength = norm(obj(2,:) - obj(1,:));

    Waist.ori = ori;
    Waist.obv = transformPointsForward(transfer, Waist.ori);
    Waist.new(1,:) = obj(1,:);
    Waist.new(2,:) = obj(2,:);
    width = getWidth(Waist, slength);
    waist_width = width * sideways.tempH;
    waist_len = waist_width * pi + 4 * (waist_front / 2 - waist_width / 2);

    %% Chest
    chest_len_male = waist_len;
    mask = getPi(90 - angle);
    chest_width = sin(getPi(angle / 2)) / sin(mask) * chest_temp * 2;
    chest_len = chest_width * pi + 4 * (chest_front / 2 - chest_width / 2);
    
    result.waist_front = waist_front;
    result.waist_side = waist_width;
    result.waist_len = waist_len;
    result.chest_front = chest_front;
    result.chest_side = chest_width;
    result.chest_len = chest_len;
    result.chest_len_male = chest_len_male;
    result.angle = angle;
end
