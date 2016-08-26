%gain for the whole rectangle
function gain = calGain_waist(x, y, xRange, yRange, eim)
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
