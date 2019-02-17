pub fn raindrops(n: u32) -> String {
    let mut s = String::new();
    if n % 3 == 0 {
        s = s + "Pling";
    }
    if n % 5 == 0 {
        s = s + "Plang";
    }
    if n % 7 == 0 {
        s = s + "Plong";
    }
    if s.len() == 0 {
        s = n.to_string();
    }
    s
}
