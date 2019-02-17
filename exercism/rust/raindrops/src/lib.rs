const WORDS: [(u32, &'static str); 3] = [(3, "Pling"), (5, "Plang"), (7, "Plong")];

pub fn raindrops(n: u32) -> String {
    match WORDS
        .iter()
        .filter(|&(d, _)| n % d == 0)
        .map(|&(_, w)| w)
        .collect::<String>()
    {
        ref res if !res.is_empty() => res.to_string(),
        _ => n.to_string(),
    }
}
