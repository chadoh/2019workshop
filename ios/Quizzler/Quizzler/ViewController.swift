//
//  ViewController.swift
//  Quizzler
//
//  Created by Angela Yu on 25/08/2015.
//  Copyright (c) 2015 London App Brewery. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
    let allQuestions = QuestionBank()
    var questionNumber : Int = 0
    
    @IBOutlet weak var questionLabel: UILabel!
    @IBOutlet weak var scoreLabel: UILabel!
    @IBOutlet var progressBar: UIView!
    @IBOutlet weak var progressLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        updateUI()
    }


    @IBAction func answerPressed(_ sender: AnyObject) {
        checkAnswer(sender.tag == 1)
        nextQuestion()
        updateUI()
    }
    
    
    func updateUI() {
      questionLabel.text = allQuestions.list[questionNumber].questionText
    }
    

    func nextQuestion() {
        if questionNumber + 1 < allQuestions.list.count {
            questionNumber = questionNumber + 1
        }
        else {
            let alert = UIAlertController(title: "Awesome", message: "You've finished all the questions, do you want to start over?", preferredStyle: .alert
            )
            let restartAction = UIAlertAction(title: "Restart", style: .default) { (UIAlertAction) in
                self.startOver()
            }
            alert.addAction(restartAction)
            present(alert, animated: true, completion: nil)
        }
    }
    
    
    func checkAnswer(_ guessed: Bool) {
        let correct = allQuestions.list[questionNumber].answer
        if guessed == correct {
            print("You got it!")
        }
        else {
            print("wrong!")
        }
    }
    
    
    func startOver() {
        questionNumber = 0
        updateUI()
    }
    

    
}
