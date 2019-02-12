//
//  ViewController.swift
//  Dicee
//
//  Created by Chad Ostrowski on 2/10/19.
//  Copyright © 2019 Entire.Life. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    @IBOutlet weak var die1: UIImageView!
    @IBOutlet weak var die2: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        rollTheDice()
    }

    @IBAction func rollButtonPressed(_ sender: UIButton) {
        rollTheDice()
    }
    
    override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
        rollTheDice()
    }
    
    func rollTheDice() {
        die1.image = UIImage(named: "dice\(Int.random(in: 1 ... 6))")
        die2.image = UIImage(named: "dice\(Int.random(in: 1 ... 6))")
    }
}

