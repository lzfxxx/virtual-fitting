function points = getInput(n, mes)
    title(mes);
    for i = 1 : n
        [X(i), Y(i)]= ginput(1);
        points(i, :) = [X(i), Y(i)];
        plot(X(i), Y(i), 'g+');
    end
end