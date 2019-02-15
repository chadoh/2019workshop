//
//  ViewController.swift
//  8ball
//
//  Created by Chad Ostrowski on 2/13/19.
//  Copyright © 2019 Entire.Life. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    @IBOutlet weak var ball: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        shakeThe8ball()
    }
    
    func shakeThe8ball() {
        ball.image = UIImage(named: "ball\(Int.random(in: 1 ... 5))")
    }

    @IBAction func buttonPress(_ sender: UIButton) {
        shakeThe8ball()
    }
    
    override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
        shakeThe8ball()
    }
}

