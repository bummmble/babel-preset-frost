function* test() {
    let idx = 0;
    while (true) {
        yield idx++;
    }
}
