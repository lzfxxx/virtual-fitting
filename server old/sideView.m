function sideways = sideView(path, setting, absH, rheight, rwaist, rtoe, rchest_midpoint);
%     absH = 160;
%     findChest = 0;
%     findWaist = 1;
%     findShoulder = -1;
%     path = 'data/img/2/2.jpg';
    %% init
    findChest = setting(1);
    findWaist = setting(2);
    findShoulder = setting(3);
    rtop = rheight(1, :);
    rbot = rheight(2, :);
    rleftWaist = rwaist(1, :);
    rrightWaist = rwaist(2, :);
%     rleftChest = rchest(1, :);
%     rrightChest = rchest(2, :);
    im = imread(path);

    %% edge detection init
    %Sobel is the best, then Prewitt, Canny, Roberts
    binImage = rgb2gray(im);
    eim = edge(binImage, 'Sobel');
%     figure;
%     imshow(im);
%     hold on;
    
    %height init
    
    %points = getInput(2, 'height');
    points = rheight;
%     line(points(:, 1),points(:, 2), 'linewidth', 3);
    sole = points(2, :);
    
    %toe = getInput(1, 'toe');
    toe = rtoe;
%     line([sole(1, 1), toe(1, 1)], [sole(1, 2), toe(1, 2)]);
    temp = [sole(1, 1), toe(1, 2)];
    len1 = norm(temp - toe);
    len2 = norm(toe - sole);
    angle = asin(len1 / len2);
    
    roof = points(1, :);
    foot = points(2, :);
    midPoint_x = (points(1, 1) + points(2, 1)) / 2;

    waist_y = (1 * points(1, 2) + 0.618 * points(2, 2)) / 1.618;
    throat_y = (1 * points(1, 2) + 0.618 * waist_y) / 1.618;
    chest_y = (0.618 * throat_y + 1 * waist_y) / 1.618;
    
    shoulder_top_y =  (points(1, 2) + 0.1 * points(2, 2)) / 1;
    shoulder_bot_y =  (points(1, 2) + 0.22 * points(2, 2)) / 1;%for sideways

%     plot(midPoint_x, waist_y, 'r+');
%     plot(midPoint_x, throat_y, 'r+');
%     plot(midPoint_x, chest_y, 'r+');
%     plot(midPoint_x, shoulder_top_y, 'g*')
%     plot(midPoint_x, shoulder_bot_y, 'g*')

    %% parameters init
    minW = 20;
    maxW = 50;
    minC = 20;
    maxC = 50;
    relH = norm(points(2, :) - points(1, :));%top-bottom
    tempH = absH / relH;
    minRelW = minW / tempH / 2;%switch to relative waistline distance on image
    maxRelW = maxW / tempH / 2;
    minRelC = minC / tempH / 2;%switch to relative waistline distance on image
    maxRelC = maxC / tempH / 2;
    leftWaist = [-1, -1];
    rightWaist = [-1, -1];
    leftChest = [-1, -1];
    rightChest = [-1, -1];
    leftShoulder = [-1, -1];
    rightShoulder = [-1, -1];
    chestPoint = [-1, -1];
    leftWaist_x = -1;
    rightWaist_x = -1;
    leftChest_x = -1;
    rightChest_x = -1;

%% find waistline
    if findWaist == 0
        %points = getInput(2, 'waist');
        points = rwaist;
        leftWaist = points(1, :);
        rightWaist = points(2, :);
    elseif findWaist == 1
        %% waistline left side
        head = int32(midPoint_x - minRelW);
        tail = int32(midPoint_x - maxRelW);
        y = int32(waist_y);

        result = 0;
        xRange = 4;
        yRange = int32(4 / tempH);%relative distance of 4cm

        for i = head : -1 : tail
            if eim(y, i) == 1 %parameter order of eim(y, x) is different from plot(x, y)
                gain = calGain_waist(i, y, xRange, yRange, eim);
                if gain > result
                    %plot(i, y, 'g+');
                    result = gain;
                    leftWaist_x = i;
                end
            end
        end
        
        leftWaist_y = waist_y;
        
        if leftWaist_x == -1
            display('unable to auto detect waist');
        end
        
%         plot(leftWaist_x, y, 'g+');
        
        leftWaist = double([leftWaist_x, leftWaist_y]);

        %% waistline right side
        head = int32(midPoint_x + minRelW);
        tail = int32(midPoint_x + maxRelW);
        y = int32(waist_y);

        result = 0;
        xRange = 4;
        yRange = int32(4 / tempH);%relative distance of 4cm

        for i = head : tail
            if eim(y, i) == 1 %parameter order of eim(y, x) is different from plot(x, y)
                gain = calGain_waist(i, y, xRange, yRange, eim);
                if gain > result
                    %plot(i, y, 'g+');
                    result = gain;
                    rightWaist_x = i;
                end
            end
        end
        
        rightWaist_y = waist_y;
        
        if rightWaist_x == -1
            display('unable to auto detect waist');
        end

%         plot(rightWaist_x, y, 'g+');
        
        rightWaist = double([rightWaist_x, rightWaist_y]);
    end   
%%
%%find shoulder
 
    if findShoulder == 0
        points = getInput(2, 'shoulder');
        leftShoulder = points(1, :);
        rightShoulder = points(2, :);
    elseif findShoulder == 1
        %% left shoulder
        top = int32(shoulder_top_y);
        bot = int32(shoulder_bot_y);
        x = leftWaist_x;
        
        result = 0;
        xRange = int32(3 / tempH);
        yRange = int32(3 / tempH);
        
        for i = top : bot
            if eim(i, x) == 1 %parameter order of eim(y, x) is different from plot(x, y)
                gain = calGain_shoulder(x, i, xRange, yRange, eim);%0 means left shoulder
                if gain > result
                    %plot(x, i, 'g+');
                    result = gain;
                    leftShoulder_y = i;
                end
            end
        end
        
        leftShoulder_x = leftWaist_x;

%         plot(leftShoulder_x, leftShoulder_y, 'g+');
        
        leftShoulder = double([leftShoulder_x, leftShoulder_y]);

        %% right shoulder
        top = int32(shoulder_top_y);
        bot = int32(shoulder_bot_y);
        x = rightWaist_x;
        
        result = 0;
        xRange = int32(3 / tempH);
        yRange = int32(3 / tempH);
        
        for i = top : bot
            if eim(i, x) == 1 %parameter order of eim(y, x) is different from plot(x, y)
                gain = calGain_shoulder(x, i, xRange, yRange, eim);%0 means left shoulder
                if gain > result
                    %plot(x, i, 'g+');
                    result = gain;
                    rightShoulder_y = i;
                end
            end
        end
        
        rightShoulder_x = rightWaist_x;

%         plot(rightShoulder_x, rightShoulder_y, 'g+');
        
        rightShoulder = double([rightShoulder_x, rightShoulder_y]);
    end

% find chest
    if findChest == 0
        points = getInput(2, 'chest');
        leftChest = points(1, :);
        rightChest = points(2, :);
    elseif findChest == 1
    %% chest left side
        head = int32(midPoint_x - minRelC);
        tail = int32(midPoint_x - maxRelC);
        y = int32(chest_y);

        result = 0;
        xRange = 4;
        yRange = int32(4 / tempH);%relative distance of 4cm

        for i = head : -1 : tail
            if eim(y, i) == 1 %parameter order of eim(y, x) is different from plot(x, y)
                gain = calGain_chest(i, y, xRange, yRange, eim);
                if gain > result
                    %plot(i, y, 'g+');
                    result = gain;
                    leftChest_x = i;
                end
            end
        end
       
        leftChest_y = chest_y;

        if leftChest_x == -1
            display('unable to auto detect waist');
        end
        
%         plot(leftChest_x, y, 'g+');
        
        leftChest = double([leftChest_x, leftChest_y]);

    %% chest right side
        head = int32(midPoint_x + minRelC);
        tail = int32(midPoint_x + maxRelC);
        y = int32(chest_y);

        result = 0;
        xRange = 4;
        yRange = int32(4 / tempH);%relative distance of 4cm

        for i = head : tail
            if eim(y, i) == 1 %parameter order of eim(y, x) is different from plot(x, y)
                gain = calGain_chest(i, y, xRange, yRange, eim);
                if gain > result
                    %plot(i, y, 'g+');
                    result = gain;
                    rightChest_x = i;
                end
            end
        end

        rightChest_y = chest_y;
    
        if rightChest_x == -1
            display('unable to auto detect waist');
        end
        
%         plot(rightChest_x, y, 'g+');
        
        rightChest = double([rightChest_x, rightChest_y]);

    end
    
    %% return
    
    sideways.leftWaist = leftWaist;
    sideways.rightWaist = rightWaist;
%     sideways.leftChest = leftChest;
%     sideways.rightChest = rightChest;
    sideways.tempH = tempH;
    
    %midpoint = getInput(1, 'chest midpoint');
    chest_midpoint = rchest_midpoint;
    sideways.chestMidpoint = chest_midpoint;
    
    %para_rmatrix1 = [roof; foot; [midPoint_x, throat_y]; [midPoint_x, waist_y]; leftWaist; rightWaist; leftChest; rightChest];
    %para_rmatrix2 = [roof; foot; [midPoint_x, throat_y]; [midPoint_x, waist_y]; leftChest; rightChest];
    para_rmatrix = [roof; foot; leftWaist; rightWaist; chest_midpoint];
    sideways.rm = double(para_rmatrix);
    sideways.angle = getAngle(angle);
 end