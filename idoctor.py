import re
import warnings
warnings.filterwarnings(action='ignore', category=UserWarning, module='gensim')
import gensim
from gensim import corpora
from nltk.corpus import stopwords 
from nltk.stem.wordnet import WordNetLemmatizer
import string
from nltk.tokenize import sent_tokenize
import sys,json

def split_line(line):
    cols = line.split("\t")
    return cols

def get_words(cols):
    words_ids = cols[4].split(" ")
    words = [w.split("#")[0] for w in words_ids]
    return words

def get_positive(cols):
    return cols[2]

def get_negative(cols):
    return cols[3]

def get_objective(cols):
    return 1 - (float(cols[2]) + float(cols[3]))

def get_gloss(cols):
    return cols[5]

def get_scores(filepath, sentiword):

    f = open(filepath)
    totalobject =0.0
    count =0.0
    totalpositive =0.0
    totalnegative =0.0
    for line in f:
        if not line.startswith("#"):
            cols = split_line(line)
            words = get_words(cols)
           # print(words)
            
            for word in sentiword:

                if word in words:
                    if word == "not":
                        totalobject = totalobject + 0
                        totalpositive = totalpositive + 0
                        totalnegative = totalnegative + 16
                        count =count + 1
                    else:

                        #print("For given word {0} - {1}".format(word, get_gloss(cols)))
                        #print("P Score: {0}".format(get_positive(cols)))
                        #print("N Score: {0}".format(get_negative(cols)))
                        #print("O Score: {0}\n".format(get_objective(cols)))
                        totalobject = totalobject + get_objective(cols)
                        totalpositive = totalpositive + float(get_positive(cols))
                        totalnegative = totalnegative + float(get_negative(cols))
                        count =count + 1
    if count >0:
        if totalpositive > totalnegative :
            #print("Positive :")
            #print("Positive value : ",totalpositive)
            #print("Negative value : ",totalnegative)
            print(totalobject/count,end=' ')
        else :
            #print("Negative :")
            #print("Positive value : ",totalpositive)
            #print("Negative value : ",totalnegative)
            print(-totalobject/count,end=' ')

        

            
# clean data 
def clean(doc):
    stop_free = " ".join([i for i in doc.lower().split() if i not in stop])
    punc_free = ''.join(ch for ch in stop_free if ch not in exclude)
    normalized = " ".join(lemma.lemmatize(word) for word in punc_free.split())
    return normalized


if __name__ == "__main__":
    comment = sys.stdin.readlines()
    comment = json.loads(comment[0])
    #print(comment)
    stop = set(stopwords.words('english'))
    exclude = set(string.punctuation)
    lemma = WordNetLemmatizer()
    doc_clean = clean(comment)
    data = doc_clean.split(" ")
    #print(data)
	 
	 
    
    get_scores("SentiWordNet_3.0.0_20130122.txt",data)
  
payment =['amount', 'award', 'cash', 'deposit', 'disbursement', 'fee', 'outlay', 'pension', 'premium', 'refund', 'reimbursement', 'remittance', 'reparation', 'repayment', 'restitution', 'return', 'reward', 'salary', 'settlement', 'subsidy', 'sum', 'support', 'wage', 'acquittal', 'advance', 'alimony', 'amends', 'amortization', 'annuity', 'bounty', 'defrayal', 'defrayment', 'discharge', 'down', 'hire', 'indemnification', 'part', 'portion', 'quittance', 'reckoning', 'recompense', 'redress', 'remuneration', 'requital', 'retaliation', 'pay-off', 'paying','amends', 'expiation', 'indemnification', 'payment', 'penance', 'propitiation', 'recompense', 'redemption', 'redress', 'reparation', 'restitution', 'satisfaction','debt','whole','penalty','atonement','banknote', 'bread', 'buck', 'bullion', 'cabbage', 'chicken', 'feed', 'coin', 'coinage', 'currency', 'dinero', 'dough', 'funds', 'green', 'stuff', 'investment', 'legal', 'tender', 'lot', 'mazumah', 'note', 'payment', 'pledge', 'principal', 'ready', 'assets', 'refund', 'remuneration', 'reserve', 'resources', 'riches', 'savings', 'scratch', 'security', 'skins', 'stock', 'supply', 'treasure', 'wampum', 'wherewithal']

trustworthiness =['dependability', 'perseverance', 'steadfastness', 'steadiness', 'truthfulness', 'adherence', 'allegiance', 'ardor', 'attachment', 'certainty', 'decision', 'determination', 'devotedness', 'devotion', 'doggedness', 'eagerness', 'earnestness', 'endurance', 'faith', 'fealty', 'fidelity', 'firmness', 'honesty', 'honor', 'integrity', 'love', 'loyalty', 'permanence', 'principle', 'regularity', 'resolution', 'stability', 'staunchness', 'surety', 'tenacity', 'trustiness', 'unchangeableness', 'uniformity', 'zeal', 'abidingness', 'unfailingness','trustworthiness']



Appointments =['assignment', 'consultation', 'date', 'interview', 'invitation', 'assignation', 'engagement', 'errand', 'gig', 'meet', 'rendezvous', 'session', 'tryst', 'blind date', 'zero hour','appointment', 'call', 'holiday', 'interview', 'stay', 'stop', 'stopover', 'talk', 'vacation', 'evening', 'sojourn', 'tarriance', 'visitation', 'weekend','visit']


Behaviour = ['good','well','humane','clear', 'conclusive', 'confident', 'decisive', 'specific', 'absolute', 'affirmative', 'cold', 'concrete', 'express', 'firm', 'perfect', 'rank', 'real', 'actual', 'assured', 'categorical', 'clear-cut', 'cocksure', 'complete', 'consummate', 'convinced', 'decided', 'direct', 'downright', 'explicit', 'factual', 'forceful', 'forcible', 'genuine', 'hard', 'inarguable', 'incontestable', 'incontrovertible', 'indisputable', 'indubitable', 'irrefutable', 'out-and-out', 'outright', 'sure', 'thorough', 'thoroughgoing', 'unambiguous', 'undeniable', 'unequivocal', 'unmistakable', 'unmitigated','acceptable', 'bad', 'excellent', 'exceptional', 'favorable', 'great', 'marvelous', 'positive', 'satisfactory', 'satisfying', 'superb', 'valuable', 'wonderful', 'ace', 'boss', 'bully', 'capital', 'choice', 'crack', 'nice', 'pleasing', 'prime', 'rad', 'sound', 'spanking', 'sterling', 'super', 'superior', 'welcome', 'worthy', 'admirable', 'agreeable', 'commendable', 'congenial', 'deluxe', 'first-class', 'first-rate', 'gnarly', 'gratifying', 'honorable', 'neat', 'precious', 'recherché', 'reputable', 'select', 'shipshape', 'splendid', 'stupendous', 'super-eminent', 'super-excellent', 'tip-top', 'up to snuff']
f1=0
for i in payment:
    if(i in data):
        f1=1
        break
f2=0
for i in trustworthiness:
    if(i in data):
        f2=1
        break
f3=0
for i in Appointments:
    if(i in data):
        f3=1
        break
f4=0
for i in Behaviour:
    if(i in data):
        f4=1
        break	

print(f1,f2,f3,f4)
	

	
	
	
	
	
