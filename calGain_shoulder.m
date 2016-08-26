%gain for the slice
%for dissertation, explain how to calc the slice (how to deduct the two triangles)
function gain = calGain_shoulder(x, y, xRange, yRange, eim)
    count = 0;
    for i = y - yRange : y + yRange
        for j = x - xRange : x + xRange
            if eim(i, j) == 1
                count = count + 1;
            end
        end
    end
    gain = count;
end
