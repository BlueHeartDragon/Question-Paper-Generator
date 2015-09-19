var sqlite3 = require('sqlite3');

exports.Question_papers_repository = function(path){
    this.db = new sqlite3.Database(path);
    this.db.run("PRAGMA foreign_keys = 'ON';");
}

function getInsertQuestionsQuery(questionPaper, id) {
    var insertQuery = "insert into questionDictionary(questionId,questionPaperId) values";
    var values = "";
    questionPaper.forEach(function (question) {
        question["questionPaperId"] = id.id;
        values = '(' + question.id + ',' + question.questionPaperId + '),';
    })
    var values = values.replace(/,$/, "");
    return insertQuery+values;
}

exports.Question_papers_repository.prototype ={
    getAllQuestionPapers : function(oncomplete){
        this.db.all("select * from questionPapers",oncomplete)
    },
    saveQuestionPaper : function(questionPaperName,onComplete,questionPaper) {
        var query = "insert into questionPapers(questionPaperName) values('" + questionPaperName + "')";
        var selectIdQuery = "select id from questionPapers where questionPaperName='" + questionPaperName + "'";
        var db = this.db;
        this.db.run(query);
        this.db.get(selectIdQuery, function (err, id) {
            var insertQuery = getInsertQuestionsQuery(questionPaper, id);
            db.run(insertQuery, onComplete)
        });
    }

}