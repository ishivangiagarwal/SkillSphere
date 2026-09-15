// Database seeder - creates admin/mentor accounts and a set of sample courses with real lesson content.
// Run with: npm run seed
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');

const COURSES = [
  {
    title: 'Complete MERN Stack Development',
    description: 'Learn to build full-stack web applications using MongoDB, Express, React and Node.js.',
    category: 'Web Development',
    level: 'Intermediate',
    tags: ['mern', 'react', 'nodejs', 'mongodb'],
    duration: 20,
    lessons: [
      {
        title: 'Introduction to MERN Stack',
        duration: 15,
        content: `The MERN stack is four technologies working together in one flow:

Browser (React) --> HTTP request --> Server (Express on Node) --> Mongoose --> MongoDB

1) MongoDB stores data as documents, similar to JSON:
{ "_id": "1", "name": "Aman", "course": "MERN" }

2) Express + Node run your server and define routes:
app.get('/api/students', (req, res) => {
  res.json({ name: 'Aman' });
});

3) React renders the UI and calls that route from the browser:
fetch('/api/students').then(res => res.json()).then(data => console.log(data));

4) Node.js is the JavaScript runtime that lets Express run outside the browser.

Key idea to remember: React never talks to MongoDB directly. It always goes
through your Express API. That one rule explains almost every bug beginners
hit early on ("why can't my component read the database?" — because it isn't
supposed to; it has to ask the server).`,
      },
      {
        title: 'Setting up Express Server',
        duration: 20,
        content: `Steps to create a real Express server from scratch:

1) Initialize the project:
npm init -y
npm install express

2) Create server.js:
const express = require('express');
const app = express();

app.use(express.json()); // lets Express read JSON request bodies

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(5000, () => console.log('Server running on port 5000'));

3) Run it:
node server.js

4) Test it by visiting http://localhost:5000/api/health in a browser — you
should see {"status":"ok"}.

Common mistake: forgetting app.use(express.json()). Without it, req.body
will be undefined in your POST routes, even if the client sent JSON
correctly — this single missing line causes a huge number of beginner bugs.`,
      },
      {
        title: 'Connecting to MongoDB with Mongoose',
        duration: 25,
        content: `Mongoose lets you define a schema (the shape of your data) and a model
(what you use to query the database).

1) Install and connect:
npm install mongoose

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI);

2) Define a schema and model:
const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: Number,
});
const Student = mongoose.model('Student', studentSchema);

3) Basic CRUD operations:
await Student.create({ name: 'Aman', email: 'aman@test.com', age: 21 }); // Create
const students = await Student.find();                                   // Read all
const one = await Student.findById(id);                                  // Read one
await Student.findByIdAndUpdate(id, { age: 22 });                        // Update
await Student.findByIdAndDelete(id);                                     // Delete

The "required: true" and "unique: true" options are validation rules —
Mongoose rejects the write before it ever reaches MongoDB if these fail,
saving you from bad data getting into your database.`,
      },
      {
        title: 'Building React Components',
        duration: 30,
        content: `A React component is just a function that returns JSX (HTML-like syntax).

1) A basic component:
function StudentCard({ name, course }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{course}</p>
    </div>
  );
}

2) Using useState to manage data that changes:
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}

3) Using useEffect to fetch data when the component loads:
import { useEffect, useState } from 'react';

function StudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(data => setStudents(data));
  }, []); // empty array = run once when component mounts

  return (
    <ul>
      {students.map(s => <li key={s._id}>{s.name}</li>)}
    </ul>
  );
}

Rule to remember: state (useState) is for data that changes and should
re-render the UI. Props are for data passed down from a parent component.
Mixing these up is the most common source of confusion for beginners.`,
      },
    ],
  },
  {
    title: 'JavaScript Fundamentals for Beginners',
    description: 'A ground-up introduction to JavaScript: variables, functions, loops, and the DOM.',
    category: 'Programming Basics',
    level: 'Beginner',
    tags: ['javascript', 'basics', 'programming'],
    duration: 12,
    lessons: [
      {
        title: 'Variables and Data Types',
        duration: 15,
        content: `Three ways to declare a variable in JavaScript:

let age = 21;        // can be reassigned later
const name = "Amit"; // cannot be reassigned
var oldStyle = "avoid using var"; // outdated, avoid in new code

Common data types:
let text = "hello";        // string
let number = 42;           // number
let isActive = true;       // boolean
let nothing = null;        // intentionally empty
let notSet;                // undefined (declared but no value)

Type checking:
typeof "hello"   // "string"
typeof 42        // "number"
typeof true      // "boolean"

Important gotcha — always use === instead of ==:
"5" == 5    // true  (JavaScript converts types automatically — confusing!)
"5" === 5   // false (checks value AND type — predictable and safer)

Rule of thumb: always prefer const. Only use let when you know the value
needs to change. Never use var in new code.`,
      },
      {
        title: 'Functions and Scope',
        duration: 20,
        content: `Three ways to write a function that does the same thing:

function add(a, b) {
  return a + b;
}

const add2 = function (a, b) {
  return a + b;
};

const add3 = (a, b) => a + b; // arrow function, shortest form

Default parameters:
function greet(name = "Guest") {
  return "Hello, " + name;
}
greet();        // "Hello, Guest"
greet("Amit");  // "Hello, Amit"

Scope example — a variable declared with let/const only exists inside the
block { } where it was created:
function example() {
  let x = 10;
  if (true) {
    let x = 20; // this is a DIFFERENT x, only exists inside this if-block
    console.log(x); // 20
  }
  console.log(x); // 10 (outer x is unaffected)
}

Closures — a function "remembers" variables from where it was created:
function makeCounter() {
  let count = 0;
  return function () {
    count++;
    return count;
  };
}
const counter = makeCounter();
counter(); // 1
counter(); // 2 (count was remembered between calls)`,
      },
      {
        title: 'Arrays and Objects',
        duration: 20,
        content: `Arrays hold ordered lists of values:

const fruits = ["apple", "banana", "mango"];
fruits[0];          // "apple"
fruits.length;       // 3
fruits.push("kiwi"); // adds to the end

Common array methods used constantly in real code:

const numbers = [1, 2, 3, 4, 5];

numbers.map(n => n * 2);        // [2, 4, 6, 8, 10] — transform each item
numbers.filter(n => n > 2);     // [3, 4, 5]        — keep matching items
numbers.reduce((sum, n) => sum + n, 0); // 15        — combine into one value

Objects hold key-value pairs:

const student = {
  name: "Priya",
  age: 21,
  skills: ["React", "Node.js"]
};

student.name;        // "Priya" (dot notation)
student["age"];       // 21      (bracket notation)

Destructuring — pulling values out directly:

const { name, age } = student;
console.log(name); // "Priya"

const [first, second] = fruits;
console.log(first); // "apple"

You will use map(), filter(), and destructuring in almost every React
component you write, so make sure these feel comfortable before moving on.`,
      },
      {
        title: 'DOM Manipulation Basics',
        duration: 25,
        content: `The DOM is how JavaScript reads and changes what's on a webpage.

Selecting elements:
const title = document.querySelector("h1");
const allButtons = document.querySelectorAll("button");

Changing content and style:
title.textContent = "New Title";
title.style.color = "blue";

Creating and adding new elements:
const newItem = document.createElement("li");
newItem.textContent = "New task";
document.querySelector("ul").appendChild(newItem);

Responding to events:
const button = document.querySelector("#myButton");
button.addEventListener("click", () => {
  alert("Button was clicked!");
});

A small complete example — a click counter without any framework:
<button id="btn">Click me</button>
<p id="count">0</p>

<script>
  let count = 0;
  document.querySelector("#btn").addEventListener("click", () => {
    count++;
    document.querySelector("#count").textContent = count;
  });
</script>

This is exactly the problem React's useState solves automatically — instead
of manually finding an element and updating its text, you just change state
and React re-renders the UI for you.`,
      },
    ],
  },
  {
    title: 'Python for Data Science',
    description: 'Get hands-on with Python, Pandas, and NumPy to analyze and visualize real datasets.',
    category: 'Data Science',
    level: 'Beginner',
    tags: ['python', 'data-science', 'pandas'],
    duration: 18,
    lessons: [
      {
        title: 'Python Basics Recap',
        duration: 15,
        content: `Quick recap of Python syntax you'll need going forward:

Variables and types:
name = "Riya"
age = 21
gpa = 8.7
is_enrolled = True

Conditionals:
if age >= 18:
    print("Adult")
else:
    print("Minor")

Loops:
for i in range(5):
    print(i)  # prints 0 1 2 3 4

Lists and dictionaries:
scores = [85, 90, 78]
student = {"name": "Riya", "age": 21}
print(student["name"])  # Riya

Functions:
def average(numbers):
    return sum(numbers) / len(numbers)

average(scores)  # 84.33

Note the difference from JavaScript: Python uses indentation (whitespace)
instead of curly braces { } to define code blocks. Getting indentation
wrong is the single most common error for beginners coming from JS.`,
      },
      {
        title: 'Introduction to NumPy',
        duration: 20,
        content: `NumPy arrays are faster than plain Python lists for numeric work.

import numpy as np

arr = np.array([1, 2, 3, 4, 5])
arr.mean()   # 3.0
arr.sum()    # 15
arr.std()    # standard deviation

Element-wise operations (no loop needed):
arr * 2        # array([2, 4, 6, 8, 10])
arr + 10       # array([11, 12, 13, 14, 15])

Compare that to a plain Python list, which needs a loop:
squared = [x * 2 for x in [1, 2, 3, 4, 5]]  # more verbose, and slower at scale

2D arrays (like a small table):
matrix = np.array([[1, 2], [3, 4]])
matrix.shape   # (2, 2)
matrix[0, 1]   # 2 (row 0, column 1)

Broadcasting — NumPy automatically applies an operation across an array:
prices = np.array([100, 200, 300])
prices * 1.18   # array([118., 236., 354.]) — adds 18% tax to every price at once`,
      },
      {
        title: 'Data Analysis with Pandas',
        duration: 25,
        content: `Pandas is built on top of NumPy and is the standard tool for tabular data.

import pandas as pd

df = pd.read_csv("students.csv")

df.head()      # first 5 rows
df.info()      # column types and missing values
df.describe()  # mean, min, max, etc for numeric columns

Selecting data:
df["name"]                    # one column
df[["name", "gpa"]]           # multiple columns
df[df["gpa"] > 8.0]           # filter rows where GPA > 8.0

Handling missing values:
df.isnull().sum()             # count missing values per column
df.dropna()                   # remove rows with missing values
df.fillna(0)                  # replace missing values with 0

Grouping and aggregating:
df.groupby("course")["gpa"].mean()
# Groups students by course, then averages GPA within each group —
# similar to GROUP BY in SQL.

Merging two datasets (like a SQL JOIN):
pd.merge(students_df, courses_df, on="course_id")`,
      },
      {
        title: 'Data Visualization Basics',
        duration: 20,
        content: `Turning data into charts using Matplotlib and Seaborn.

import matplotlib.pyplot as plt
import seaborn as sns

Bar chart:
df["course"].value_counts().plot(kind="bar")
plt.title("Students per Course")
plt.show()

Line chart (good for trends over time):
plt.plot(df["month"], df["signups"])
plt.xlabel("Month")
plt.ylabel("Signups")
plt.show()

Histogram (good for seeing the distribution of a single column):
plt.hist(df["gpa"], bins=10)
plt.show()

Seaborn scatter plot with color grouping — useful for spotting relationships
between two numeric columns, split by a category:
sns.scatterplot(data=df, x="study_hours", y="gpa", hue="course")
plt.show()

Rule of thumb for choosing a chart type:
- Comparing categories -> bar chart
- Showing a trend over time -> line chart
- Showing distribution of one variable -> histogram
- Showing relationship between two variables -> scatter plot`,
      },
    ],
  },
  {
    title: 'React Native Mobile App Development',
    description: 'Build cross-platform mobile apps for iOS and Android using React Native.',
    category: 'Mobile Development',
    level: 'Intermediate',
    tags: ['react-native', 'mobile', 'ios', 'android'],
    duration: 16,
    lessons: [
      {
        title: 'React Native Environment Setup',
        duration: 15,
        content: `Fastest way to start: Expo (no native build tools required).

1) Install the CLI and create a project:
npm install -g expo-cli
npx create-expo-app MyFirstApp
cd MyFirstApp

2) Run it:
npx expo start

This opens a QR code in your terminal. Scan it with the Expo Go app on
your phone (available on the App Store / Play Store) to see your app live,
or press "i" for an iOS simulator / "a" for an Android emulator if you have
one installed.

3) Basic project structure:
MyFirstApp/
  App.js        <- your app starts here
  package.json
  assets/

4) A minimal App.js:
import { Text, View } from 'react-native';

export default function App() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Hello, mobile world!</Text>
    </View>
  );
}

Save the file — Expo automatically reloads the app on your device within
a second or two, so you get a very fast feedback loop while building.`,
      },
      {
        title: 'Core Components and Styling',
        duration: 20,
        content: `React Native has its own set of components — there is no HTML.

import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

function ProfileCard() {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: 'https://example.com/avatar.png' }}
        style={styles.avatar}
      />
      <Text style={styles.name}>Ankit Sharma</Text>
      <Text style={styles.role}>Mentor</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  name: { fontSize: 18, fontWeight: 'bold', marginTop: 8 },
  role: { fontSize: 14, color: '#666' },
});

Key differences from web CSS:
- No "px" units — just plain numbers (width: 80, not width: '80px')
- Layout is Flexbox by default, even without setting display: 'flex'
- className doesn't exist — you always use the style prop with StyleSheet
  objects or inline objects`,
      },
      {
        title: 'Navigation Between Screens',
        duration: 25,
        content: `React Navigation is the standard library for moving between screens.

1) Install it:
npm install @react-navigation/native @react-navigation/native-stack

2) Set up a stack navigator:
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import DetailScreen from './DetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

3) Navigate and pass data between screens:
// Inside HomeScreen.js
function HomeScreen({ navigation }) {
  return (
    <Button
      title="View Course"
      onPress={() => navigation.navigate('Detail', { courseId: 42 })}
    />
  );
}

// Inside DetailScreen.js
function DetailScreen({ route }) {
  const { courseId } = route.params;
  return <Text>Showing course #{courseId}</Text>;
}

This "params" pattern — passing an id forward, then reading it with
route.params — is the same pattern you'll use for almost every
list-to-detail screen flow in a real app.`,
      },
      {
        title: 'Connecting to a REST API',
        duration: 20,
        content: `Fetching and displaying remote data with loading/error states.

import { useEffect, useState } from 'react';
import { FlatList, Text, ActivityIndicator, View } from 'react-native';

function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://your-api.com/api/courses')
      .then(res => res.json())
      .then(data => {
        setCourses(data.courses);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <FlatList
      data={courses}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <View style={{ padding: 12 }}>
          <Text>{item.title}</Text>
        </View>
      )}
    />
  );
}

Why FlatList instead of just mapping over an array like on the web? FlatList
only renders the items currently visible on screen, which keeps long lists
scrolling smoothly even with thousands of items — a plain .map() would
render every item at once and could slow the app down.`,
      },
    ],
  },
  {
    title: 'DevOps Essentials: Docker & CI/CD',
    description: 'Containerize applications with Docker and automate deployments with CI/CD pipelines.',
    category: 'DevOps',
    level: 'Advanced',
    tags: ['docker', 'devops', 'ci-cd'],
    duration: 14,
    lessons: [
      {
        title: 'Docker Fundamentals',
        duration: 20,
        content: `An image is a blueprint. A container is a running instance of that image.

A basic Dockerfile for a Node.js app:
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]

Build and run it:
docker build -t my-app .
docker run -p 5000:5000 my-app

What each Dockerfile instruction does:
FROM     - the base image to start from (Node.js pre-installed here)
WORKDIR  - sets the working directory inside the container
COPY     - copies files from your machine into the container
RUN      - executes a command while building the image (like npm install)
EXPOSE   - documents which port the app listens on
CMD      - the command that runs when the container starts

Useful everyday commands:
docker ps                 # list running containers
docker images              # list downloaded images
docker stop <container_id> # stop a running container
docker rm <container_id>   # remove a stopped container`,
      },
      {
        title: 'Docker Compose for Multi-Container Apps',
        duration: 20,
        content: `docker-compose.yml lets you define multiple services in one file.

version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/skillsphere
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"

  mongo:
    image: mongo:6
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:

Run everything with one command:
docker-compose up

Key things to notice:
- backend can reach the database using the hostname "mongo" (the service
  name), not "localhost" — Compose sets up networking between services
  automatically.
- volumes: mongo-data persists the database's data even if you stop and
  remove the containers, so you don't lose everything on restart.
- depends_on ensures mongo starts before backend tries to connect.`,
      },
      {
        title: 'Introduction to CI/CD',
        duration: 15,
        content: `CI (Continuous Integration) — every code push automatically runs tests.
CD (Continuous Deployment) — code that passes tests is automatically deployed.

A typical pipeline has these stages, in order:

1) Build   - install dependencies, compile/bundle the app
2) Test    - run unit tests and linting automatically
3) Deploy  - push the working build to a server (Render, Netlify, etc.)

Why this matters in practice: without CI/CD, a developer might manually
test on their laptop, forget an edge case, and push broken code straight
to production. With CI/CD, the pipeline runs the full test suite on every
single push — the mistake gets caught automatically before it ever reaches
real users, and the team gets notified immediately if something fails.

The core mental model: humans push code -> automation builds, tests, and
ships it -> humans only step in if something goes wrong.`,
      },
      {
        title: 'Building a GitHub Actions Pipeline',
        duration: 25,
        content: `A GitHub Actions workflow file lives at .github/workflows/ci.yml

name: CI Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        run: npm test

What this file does, step by step:
- "on" defines the trigger: run this workflow on every push or pull
  request to the main branch.
- "runs-on" picks the virtual machine that runs the job (a fresh Ubuntu
  environment every time).
- Each "step" runs in order: check out the code, install Node.js, install
  dependencies, then run the test suite.

Storing secrets safely — never hard-code an API key in your workflow file.
Instead, add it under your repo's Settings > Secrets, then reference it:
env:
  GEMINI_API_KEY: \${{ secrets.GEMINI_API_KEY }}`,
      },
    ],
  },
  {
    title: 'Machine Learning Foundations',
    description: 'Understand core ML concepts and build your first models with scikit-learn.',
    category: 'AI & ML',
    level: 'Intermediate',
    tags: ['machine-learning', 'ai', 'scikit-learn'],
    duration: 22,
    lessons: [
      {
        title: 'What is Machine Learning?',
        duration: 15,
        content: `Machine learning = a program learns patterns from data instead of being
told exact rules by a programmer.

Traditional programming:
Rules + Data -> Program -> Output

Machine learning:
Data + Output (examples) -> Program -> Rules (the learned model)

Two main categories:

Supervised learning — you have labeled examples (input + correct answer),
and the model learns to predict the answer for new inputs.
Example: given emails labeled "spam" or "not spam", predict the label for
a brand-new email.

Unsupervised learning — you only have inputs, no labels, and the model
finds structure or groupings on its own.
Example: given customer purchase data with no labels, group customers into
clusters of similar shopping behavior.

Simple real-world mapping:
- Predicting house price from size/location  -> supervised (regression)
- Classifying an image as cat or dog          -> supervised (classification)
- Grouping similar news articles together     -> unsupervised (clustering)`,
      },
      {
        title: 'Linear Regression from Scratch',
        duration: 25,
        content: `Linear regression finds the straight line that best fits your data:
y = mx + b

Using scikit-learn directly:
from sklearn.linear_model import LinearRegression
import numpy as np

# Study hours (X) vs exam score (y)
X = np.array([[1], [2], [3], [4], [5]])  # must be 2D
y = np.array([50, 55, 65, 70, 80])

model = LinearRegression()
model.fit(X, y)

model.predict([[6]])  # predicts the score for 6 study hours
model.coef_           # the slope (m)
model.intercept_      # the intercept (b)

How training actually works, conceptually: the model starts with a random
line, measures how far off its predictions are from the real answers (the
"error"), then nudges the line slightly to reduce that error, and repeats
this thousands of times. This nudging process is called gradient descent.
The line stops moving once the error can't be reduced any further —
at that point, the model has "learned."`,
      },
      {
        title: 'Classification with scikit-learn',
        duration: 25,
        content: `Classification predicts a category, not a number.

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.tree import DecisionTreeClassifier

# Split data: 80% to train the model, 20% to test how well it learned
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train a logistic regression model
log_model = LogisticRegression()
log_model.fit(X_train, y_train)
log_model.predict(X_test)

# Train a decision tree model on the exact same data
tree_model = DecisionTreeClassifier()
tree_model.fit(X_train, y_train)
tree_model.predict(X_test)

Why split into train and test sets at all? If you test a model on the same
data it trained on, it can score perfectly just by memorizing the answers —
that tells you nothing about how it performs on new, unseen data. The test
set simulates "new data" so you get an honest measurement.

This train -> fit -> predict pattern is identical across almost every
scikit-learn model, which is exactly why the library is so easy to use
once you've learned it once.`,
      },
      {
        title: 'Model Evaluation Metrics',
        duration: 20,
        content: `Once you have predictions, how do you know if the model is actually good?

from sklearn.metrics import accuracy_score, precision_score, recall_score, confusion_matrix

accuracy_score(y_test, predictions)   # % of correct predictions overall
precision_score(y_test, predictions)  # of predicted "yes", how many were right?
recall_score(y_test, predictions)     # of actual "yes", how many did we catch?

confusion_matrix(y_test, predictions)
# [[TN, FP],
#  [FN, TP]]
# TN = correctly predicted negative   FP = wrongly predicted positive
# FN = wrongly predicted negative     TP = correctly predicted positive

Why accuracy alone can be misleading — imagine detecting a rare disease
that occurs in 1 out of 100 people. A model that always predicts "no
disease" would be 99% accurate, but completely useless, since it never
catches a single real case.

Rule of thumb for which metric to prioritize:
- False positives are costly (e.g. spam filter blocking real email)
  -> prioritize precision
- False negatives are costly (e.g. missing a disease diagnosis)
  -> prioritize recall`,
      },
    ],
  },
  {
    title: 'Advanced CSS & Responsive Design',
    description: 'Master Flexbox, Grid, animations, and responsive layouts for modern websites.',
    category: 'Web Development',
    level: 'Beginner',
    tags: ['css', 'frontend', 'responsive-design'],
    duration: 10,
    lessons: [
      {
        title: 'Flexbox Deep Dive',
        duration: 20,
        content: `Flexbox arranges items in a single row or column.

.container {
  display: flex;
  justify-content: space-between; /* spacing along the main axis */
  align-items: center;             /* alignment along the cross axis */
}

Common justify-content values:
flex-start    - items packed at the start
center        - items centered
space-between - equal space BETWEEN items (none at the edges)
space-around  - equal space around each item (including edges)

Controlling how items resize:
.item {
  flex-grow: 1;    /* item grows to fill available space */
  flex-shrink: 1;  /* item shrinks if there's not enough room */
  flex-basis: 200px; /* item's default size before growing/shrinking */
}

A practical navbar example:
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
}
<nav class="navbar">
  <div class="logo">MySite</div>
  <div class="links">Home About Contact</div>
</nav>

This one navbar pattern — flex + space-between + align-items: center —
covers probably 80% of real-world navigation bar layouts you'll build.`,
      },
      {
        title: 'CSS Grid Fundamentals',
        duration: 25,
        content: `Grid handles rows AND columns at the same time — Flexbox only handles one.

.page {
  display: grid;
  grid-template-columns: 200px 1fr;  /* sidebar 200px, main takes the rest */
  grid-template-rows: 60px 1fr 60px; /* header, content, footer */
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  height: 100vh;
}

.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main    { grid-area: main; }
.footer  { grid-area: footer; }

HTML to match:
<div class="page">
  <div class="header">Header</div>
  <div class="sidebar">Sidebar</div>
  <div class="main">Main Content</div>
  <div class="footer">Footer</div>
</div>

The "1fr" unit means "one fraction of the remaining space" — it automatically
fills whatever room is left after the fixed-size columns/rows are placed,
which is what makes Grid layouts responsive without extra calculations.

A simple responsive card grid (no media query needed):
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
This automatically fits as many 200px+ cards per row as will fit, and
wraps to a new row when there isn't enough space.`,
      },
      {
        title: 'Responsive Design with Media Queries',
        duration: 20,
        content: `Media queries apply different CSS based on screen width.

Mobile-first approach — write base styles for small screens first, then
add rules for larger screens:

/* Base styles: apply to ALL screens, mobile included */
.container {
  padding: 12px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    padding: 24px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    padding: 40px;
    max-width: 1200px;
    margin: 0 auto;
  }
}

Common breakpoints used across most real projects:
640px  - small devices
768px  - tablets
1024px - laptops
1280px - large desktops

Testing responsively without a real device: open DevTools (Ctrl+Shift+I),
click the device toolbar icon (looks like a phone/tablet), and drag the
width slider — your media queries will kick in live as you resize.`,
      },
      {
        title: 'CSS Animations and Transitions',
        duration: 15,
        content: `Transitions animate a property change smoothly over time.

.button {
  background: #6366f1;
  transition: background 0.2s ease, transform 0.2s ease;
}
.button:hover {
  background: #4f46e5;
  transform: scale(1.05);
}

Keyframe animations give more control over multi-step sequences:

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid #ddd;
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

Performance tip: animate transform and opacity, not width/height/margin.
Changing width or margin forces the browser to recalculate the entire
page layout on every frame, which can cause visible stutter. transform
and opacity can be animated by the GPU directly, which is why "modern"
animations almost always use scale(), translateX(), and opacity instead
of directly animating width or position.`,
      },
    ],
  },
  {
    title: 'Node.js & Express API Design',
    description: 'Design clean, scalable REST APIs using Node.js, Express, and best practices.',
    category: 'Web Development',
    level: 'Intermediate',
    tags: ['nodejs', 'express', 'rest-api'],
    duration: 15,
    lessons: [
      {
        title: 'RESTful API Principles',
        duration: 15,
        content: `REST maps HTTP methods to actions on a "resource" (a noun in your URL).

GET    /api/courses          -> list all courses
GET    /api/courses/:id      -> get one course
POST   /api/courses          -> create a new course
PUT    /api/courses/:id      -> replace a course entirely
PATCH  /api/courses/:id      -> update part of a course
DELETE /api/courses/:id      -> delete a course

Bad API design (verb in the URL):
GET /api/getAllCourses
POST /api/createNewCourse

Good API design (noun + HTTP method):
GET /api/courses
POST /api/courses

Common status codes and what they mean:
200 OK                  - request succeeded
201 Created              - a resource was successfully created
400 Bad Request          - client sent invalid data
401 Unauthorized         - missing or invalid authentication
403 Forbidden            - authenticated, but not allowed to do this
404 Not Found             - resource doesn't exist
500 Internal Server Error - something broke on the server

Choosing the right status code (not just always sending 200) is what lets
a frontend handle success and failure cases correctly without guessing.`,
      },
      {
        title: 'Middleware and Error Handling',
        duration: 20,
        content: `Middleware runs between the incoming request and your route handler.

A custom logging middleware:
function logger(req, res, next) {
  console.log(\`\${req.method} \${req.url}\`);
  next(); // MUST call next() or the request hangs forever
}
app.use(logger);

A custom authentication middleware:
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  next();
}
app.get('/api/profile', requireAuth, (req, res) => {
  res.json({ message: 'Protected data' });
});

Centralized error handling — instead of try/catch everywhere, throw errors
and catch them in ONE place:

app.get('/api/courses/:id', async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      res.status(404);
      throw new Error('Course not found');
    }
    res.json(course);
  } catch (err) {
    next(err); // passes the error to the error handler below
  }
});

// This must be defined LAST, after all other app.use() and routes:
app.use((err, req, res, next) => {
  res.status(res.statusCode || 500).json({ message: err.message });
});`,
      },
      {
        title: 'Authentication with JWT',
        duration: 25,
        content: `JWT (JSON Web Token) proves who a user is on every request, without the
server needing to store session data.

1) Generate a token at login:
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

2) Send it to the client, which stores it (e.g. in localStorage) and
   attaches it to every future request:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

3) Verify the token on protected routes:
function protect(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Not authorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // now available in every route after this
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

Why tokens expire — a stolen token that never expires gives an attacker
permanent access to that account. Setting expiresIn: '7d' means a stolen
token becomes useless after 7 days, limiting the damage.`,
      },
      {
        title: 'API Testing with Postman',
        duration: 15,
        content: `Testing endpoints directly, without needing a frontend built yet.

1) Create a request:
Method: POST
URL: http://localhost:5000/api/auth/login
Body (raw JSON):
{
  "email": "admin@skillsphere.com",
  "password": "Admin@123"
}

2) Send it and inspect the response — you should get back a token and
   user object if your login route works correctly.

3) Use the returned token on a protected route:
Method: GET
URL: http://localhost:5000/api/users/dashboard
Headers:
  Authorization: Bearer <paste the token here>

4) Organize related requests into a "Collection" (e.g. "SkillSphere API")
   so you can re-run the same set of requests as you keep developing,
   instead of retyping them every time.

5) Use environment variables so you can switch your base URL between
   local development and your deployed Render backend with one click:
{{baseUrl}}/api/auth/login
   where baseUrl = http://localhost:5000 locally, and your Render URL
   in production — no need to edit every single request by hand.`,
      },
    ],
  },
  {
    title: 'SQL for Beginners',
    description: 'Learn to query, filter, join, and manage relational databases using SQL.',
    category: 'Data Science',
    level: 'Beginner',
    tags: ['sql', 'databases', 'data-science'],
    duration: 10,
    lessons: [
      {
        title: 'SELECT, WHERE, and Filtering',
        duration: 15,
        content: `Every SQL query to read data starts with SELECT.

SELECT * FROM students;
-- selects ALL columns, ALL rows

SELECT name, gpa FROM students;
-- selects only the name and gpa columns

SELECT * FROM students WHERE gpa > 8.0;
-- only rows where gpa is greater than 8.0

SELECT * FROM students WHERE course = 'MERN' AND gpa > 7.5;
-- combine conditions with AND / OR

SELECT * FROM students WHERE name LIKE 'A%';
-- names starting with "A" (% is a wildcard for "anything")

SELECT * FROM students ORDER BY gpa DESC;
-- sort by gpa, highest first

SELECT * FROM students ORDER BY gpa DESC LIMIT 5;
-- top 5 students by gpa

Comparison operators you'll use constantly:
=   equal to        !=  not equal to
>   greater than     <   less than
>=  greater or equal <=  less or equal
BETWEEN 5 AND 10     -- shorthand for >= 5 AND <= 10`,
      },
      {
        title: 'JOINs Explained',
        duration: 20,
        content: `JOINs combine rows from two related tables based on a matching column.

Two example tables:
students: id, name, course_id
courses:  id, title

INNER JOIN — only rows that match in BOTH tables:
SELECT students.name, courses.title
FROM students
INNER JOIN courses ON students.course_id = courses.id;
-- a student with no matching course_id is excluded entirely

LEFT JOIN — all rows from the left table, even without a match:
SELECT students.name, courses.title
FROM students
LEFT JOIN courses ON students.course_id = courses.id;
-- a student with no matching course still appears, with courses.title as NULL

How to read this: "start from students, and for each student, also bring
in the matching course row if one exists." LEFT JOIN keeps the student
either way — INNER JOIN would drop them entirely if there's no match.

When to use which: use INNER JOIN when you only care about complete
records (a student that definitely has a course); use LEFT JOIN when
missing matches still matter — e.g. finding students who haven't
enrolled in any course yet, by checking WHERE courses.title IS NULL.`,
      },
      {
        title: 'Aggregate Functions and GROUP BY',
        duration: 20,
        content: `Aggregate functions summarize many rows into a single number.

SELECT COUNT(*) FROM students;
-- total number of students

SELECT AVG(gpa) FROM students;
-- average gpa across all students

SELECT course_id, COUNT(*) AS total_students
FROM students
GROUP BY course_id;
-- number of students PER course (not overall)

SELECT course_id, AVG(gpa) AS avg_gpa
FROM students
GROUP BY course_id
HAVING AVG(gpa) > 7.5;
-- only show courses where the average gpa is above 7.5

The key distinction:
WHERE filters individual rows BEFORE grouping happens.
HAVING filters entire groups AFTER the aggregate has been calculated.

This is why "WHERE AVG(gpa) > 7.5" is invalid SQL — WHERE runs before
AVG() has even been computed, so it doesn't know what to compare yet.
HAVING is specifically designed to filter on the result of an aggregate.`,
      },
      {
        title: 'Creating and Modifying Tables',
        duration: 15,
        content: `Defining your own database structure with CREATE TABLE.

CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  gpa DECIMAL(3,2),
  course_id INT,
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

What each constraint does:
PRIMARY KEY    - uniquely identifies each row, auto-generated here
NOT NULL       - this column cannot be left empty
UNIQUE          - no two rows can have the same value in this column
FOREIGN KEY     - links this column to another table's primary key,
                  preventing course_id from pointing to a course that
                  doesn't exist

Modifying an existing table:
ALTER TABLE students ADD COLUMN phone VARCHAR(15);
ALTER TABLE students DROP COLUMN phone;
ALTER TABLE students MODIFY COLUMN gpa DECIMAL(4,2);

Why set constraints upfront instead of "just being careful" in the app
code: constraints are enforced by the database itself, so even a bug in
your application code, or a totally different application connecting to
the same database later, can't accidentally insert bad data.`,
      },
    ],
  },
  {
    title: 'Flutter App Development Basics',
    description: 'Build beautiful cross-platform mobile apps with Flutter and Dart.',
    category: 'Mobile Development',
    level: 'Beginner',
    tags: ['flutter', 'dart', 'mobile'],
    duration: 14,
    lessons: [
      {
        title: 'Dart Language Basics',
        duration: 15,
        content: `Dart basics, side by side with the concepts:

Variables:
var name = "Riya";        // type inferred automatically
final age = 21;           // cannot be reassigned
const pi = 3.14;          // compile-time constant

Functions:
int add(int a, int b) {
  return a + b;
}

Arrow function shorthand for one-line functions:
int square(int x) => x * x;

Classes:
class Student {
  String name;
  int age;

  Student(this.name, this.age); // constructor

  void greet() {
    print("Hi, I'm \$name");
  }
}

final student = Student("Riya", 21);
student.greet(); // "Hi, I'm Riya"

Null safety — Dart forces you to handle the possibility of null explicitly:
String? nickname; // the ? means this CAN be null
String name = "Riya"; // no ?, so this can NEVER be null

nickname = null;       // allowed
name = null;            // ERROR: name is required to always have a value

This catches an entire category of "null reference" crashes at compile
time, before your app ever runs.`,
      },
      {
        title: 'Flutter Widgets 101',
        duration: 20,
        content: `In Flutter, everything on screen is a widget.

StatelessWidget — renders based only on the data passed in, never changes
on its own:
class Greeting extends StatelessWidget {
  final String name;
  const Greeting({required this.name});

  @override
  Widget build(BuildContext context) {
    return Text("Hello, \$name!");
  }
}

StatefulWidget — holds internal state that can change and trigger a
re-render:
class Counter extends StatefulWidget {
  @override
  State<Counter> createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int count = 0;

  void increment() {
    setState(() {
      count++; // setState tells Flutter to rebuild this widget
    });
  }

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: increment,
      child: Text("Clicked \$count times"),
    );
  }
}

Rule of thumb: use StatelessWidget by default. Only switch to
StatefulWidget when the widget needs to remember and change something
over time, such as a counter, a toggle, or text the user is typing.`,
      },
      {
        title: 'Layouts with Rows and Columns',
        duration: 20,
        content: `Row arranges children horizontally, Column arranges them vertically.

Row(
  mainAxisAlignment: MainAxisAlignment.spaceBetween,
  children: [
    Icon(Icons.star),
    Text("4.8 rating"),
    Icon(Icons.favorite),
  ],
)

Column(
  crossAxisAlignment: CrossAxisAlignment.start,
  children: [
    Text("Course Title", style: TextStyle(fontSize: 20)),
    SizedBox(height: 8), // fixed empty spacing
    Text("By Jane Mentor"),
  ],
)

Combining Row and Column to build a full card layout:
Container(
  padding: EdgeInsets.all(16),
  decoration: BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(12),
  ),
  child: Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text("React Native Basics"),
      SizedBox(height: 4),
      Row(
        children: [
          Icon(Icons.access_time, size: 16),
          Text(" 16 hours"),
        ],
      ),
    ],
  ),
)

Just like Flexbox on the web, mainAxisAlignment controls spacing ALONG
the direction of the Row/Column, and crossAxisAlignment controls
alignment PERPENDICULAR to it.`,
      },
      {
        title: 'Handling User Input',
        duration: 15,
        content: `Reading text input and validating a simple form.

class LoginForm extends StatefulWidget {
  @override
  State<LoginForm> createState() => _LoginFormState();
}

class _LoginFormState extends State<LoginForm> {
  final emailController = TextEditingController();
  String? errorMessage;

  void handleSubmit() {
    if (emailController.text.isEmpty) {
      setState(() {
        errorMessage = "Email is required";
      });
      return;
    }
    setState(() {
      errorMessage = null;
    });
    print("Submitting: \${emailController.text}");
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        TextField(
          controller: emailController,
          decoration: InputDecoration(
            labelText: "Email",
            errorText: errorMessage,
          ),
        ),
        ElevatedButton(
          onPressed: handleSubmit,
          child: Text("Login"),
        ),
      ],
    );
  }
}

Key idea: TextEditingController is how Flutter reads the current value
of a text field — similar to how you'd read the .value of an input in
plain JavaScript, or use a controlled input with useState in React.`,
      },
    ],
  },
  {
    title: 'Kubernetes for Beginners',
    description: 'Learn container orchestration fundamentals with Kubernetes.',
    category: 'DevOps',
    level: 'Advanced',
    tags: ['kubernetes', 'devops', 'containers'],
    duration: 16,
    lessons: [
      {
        title: 'Kubernetes Architecture',
        duration: 20,
        content: `Core building blocks, from smallest to largest:

Pod   - the smallest deployable unit; wraps one or more containers that
        share networking and storage.
Node  - a physical or virtual machine that runs Pods.
Cluster - a set of Nodes managed together by Kubernetes.

The control plane makes decisions for the whole cluster:
- API Server    - the entry point for all commands (kubectl talks to this)
- Scheduler     - decides which Node a new Pod should run on
- Controller Manager - watches the cluster and fixes drift (e.g. restarts
  a crashed Pod to match the desired state)
- etcd          - stores the cluster's current configuration and state

Basic kubectl commands to explore a cluster:
kubectl get nodes        # list all machines in the cluster
kubectl get pods         # list running pods
kubectl describe pod <name>  # detailed info about one pod
kubectl logs <pod-name>  # view a pod's console output

Mental model: you never manually place a Pod onto a specific Node.
You describe your DESIRED state (e.g. "run 3 replicas of this app"),
and the control plane figures out the rest — this is the core idea
behind everything Kubernetes does.`,
      },
      {
        title: 'Deployments and Services',
        duration: 25,
        content: `A Deployment describes the desired state of your app.

apiVersion: apps/v1
kind: Deployment
metadata:
  name: skillsphere-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: skillsphere-backend:latest
          ports:
            - containerPort: 5000

Apply it:
kubectl apply -f deployment.yaml

If a Pod crashes, the Deployment controller automatically creates a new
one to keep exactly 3 replicas running — you don't have to intervene.

A Service gives those Pods a stable network address, since individual
Pod IPs change whenever they're recreated:

apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
    - port: 80
      targetPort: 5000
  type: ClusterIP

Other Pods (or an Ingress) can now reliably reach "backend-service"
without ever needing to know which specific Pod IPs are currently alive.`,
      },
      {
        title: 'ConfigMaps and Secrets',
        duration: 15,
        content: `Keep configuration OUT of your container images.

ConfigMap — for non-sensitive values:
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  NODE_ENV: "production"
  API_VERSION: "v1"

Secret — for sensitive values (base64-encoded, not encrypted by default,
so still handle carefully in real deployments):
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  MONGO_URI: bW9uZ29kYjovL3VzZXI6cGFzc0Bob3N0    # base64 encoded

Using both inside a Pod as environment variables:
spec:
  containers:
    - name: backend
      envFrom:
        - configMapRef:
            name: app-config
        - secretRef:
            name: app-secrets

Why separate these from your image: the same Docker image can now be
deployed to development, staging, and production simply by swapping which
ConfigMap/Secret it's paired with — you never need to rebuild the image
just because a database URL changed.`,
      },
      {
        title: 'Scaling and Rolling Updates',
        duration: 20,
        content: `Manually scaling the number of replicas:
kubectl scale deployment skillsphere-backend --replicas=5

Kubernetes gradually starts 2 new Pods to reach 5 total, without
touching the 3 that are already running successfully.

Rolling update — deploying a new image version with zero downtime:
kubectl set image deployment/skillsphere-backend backend=skillsphere-backend:v2

What actually happens step by step:
1) Kubernetes starts one new Pod running v2
2) Once it's healthy, one old v1 Pod is terminated
3) This repeats until all Pods are running v2
4) At every point during the rollout, there are still working Pods
   serving traffic — users never see downtime

Watching the rollout live:
kubectl rollout status deployment/skillsphere-backend

If v2 turns out to be broken, rolling back is one command:
kubectl rollout undo deployment/skillsphere-backend

This instantly reverts back to the previous working version (v1) using
the exact same rolling strategy, so the rollback is also zero-downtime.`,
      },
    ],
  },
];

const run = async () => {
  await connectDB();

  const adminEmail = 'admin@skillsphere.com';
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: 'Platform Admin',
      email: adminEmail,
      password: 'Admin@123',
      role: 'admin',
    });
    console.log('Created admin user:', adminEmail, '/ password: Admin@123');
  } else {
    console.log('Admin user already exists:', adminEmail);
  }

  const mentorEmail = 'mentor@skillsphere.com';
  let mentor = await User.findOne({ email: mentorEmail });
  if (!mentor) {
    mentor = await User.create({
      name: 'Jane Mentor',
      email: mentorEmail,
      password: 'Mentor@123',
      role: 'mentor',
      bio: 'Full-stack developer and mentor with 8 years of experience.',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    });
    console.log('Created mentor user:', mentorEmail, '/ password: Mentor@123');
  } else {
    console.log('Mentor user already exists:', mentorEmail);
  }

  for (const courseData of COURSES) {
    const { lessons, ...courseFields } = courseData;
    let course = await Course.findOne({ title: courseFields.title });

    if (!course) {
      course = await Course.create({ ...courseFields, instructor: mentor._id });
      console.log(`Created course: ${courseFields.title}`);
    } else {
      Object.assign(course, courseFields);
      await course.save();
      console.log(`Updated existing course: ${courseFields.title}`);
    }

    // Always refresh lessons so re-running the seeder applies updated content.
    await Lesson.deleteMany({ course: course._id });
    await Lesson.insertMany(
      lessons.map((lesson, index) => ({
        course: course._id,
        title: lesson.title,
        content: lesson.content,
        duration: lesson.duration,
        order: index + 1,
      }))
    );
    console.log(`  -> Wrote ${lessons.length} lessons with real content for "${courseFields.title}"`);
  }

  console.log('Seeding complete.');
  process.exit(0);
};

run().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
