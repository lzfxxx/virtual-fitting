function width = getWidth(joint, slength)
    syms aux;
    length = norm(joint.ori(2,:) - joint.ori(1,:));
    olength = norm(joint.obv(2,:) - joint.obv(1,:));
    angle = acos(slength/length);
    num1 = ((olength / 2) * cos(angle));
    den1 = length / 2;
    num2 = ((olength / 2) * sin(angle));
    res = solve(num1 ^ 2 / den1 ^ 2 + num2 ^ 2 / aux ^ 2 - 1);
    angle = eval(res);
    width = (-2) * angle(1);
end


