import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import performanceChart from "../images/model_performance.jpg"
import "../styles/charts.css"

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "50%",
    maxHeight: "70%",
    overflow: 'scroll',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

/**
 * Returns about page modal component.
 * @returns {JSX.Element}
 * @constructor
 */
export default function AboutModal() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Button onClick={handleOpen} sx={{my: 2, color: 'white', display: 'block'}}>
                About
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <Typography style={{marginBottom: '10px'}} variant="h6" component="h2">
                            Model Performance
                        </Typography>
                        <div className="box">
                            <img className="chart" src={performanceChart}/>
                        </div>
                        <Typography id="modal-text" variant="p">
                            Scores above are in terms of Root mean square error (RMSE) in £. The lower the better.
                            The best scoring model can predict a car's price to an accuracy of £2064.48.
                            (Read below to learn more about my machine learning methodologies, limitations and ethical
                            discussions)
                        </Typography>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Methodology
                        </Typography>
                        <Typography variant="p">
                            Firstly, I have researched existing papers on the topic and learned from how others have
                            carried out their experimentation on this subject.
                            Some papers mentioned using SVM as a good means to predict the car prices while others used
                            linear regression. There were also mentions of how splitting the dataset by make improves
                            model performance. The main theme I picked up from these papers however, is that used car
                            pricing is a good machine learning problem and has scope for exploration using various
                            machine learning methods and algorithms.
                            Next, I set out to learn more deeply about regression. I was able to code them in python and
                            explain fundamental regression techniques for linear, k-nearest neighbour and ridge
                            regression. Coding each from scratch using mathematical formulas and online guides gave me a
                            deeper insight into how these models work and their limitations. To apply and test what I
                            learned I also applied these algorithms on smaller datasets such as the iris dataset and
                            created plots to visually represent the model.
                            I also tested it on a good sized (100k entries) dataset for used cars which I pre-processed
                            and encoded. The k-nearest neighbour algorithm performed the worst with an RMSE score of
                            £14,027.59. Linear and ridge regression both performed better with an RMSE of £4,942.61.
                            These scores were quite high however, in experimenting with them I learned a lot about how
                            to use machine learning algorithms and was ready to explore further.
                            Then, I was able to take what I learned and apply it further by experimenting using other
                            algorithms. To do this I used Sklearn’s machine learning map as well as indications from my
                            prior research to decide which algorithms to use for my data and problem type. I created a
                            routine in python that tests and logs each algorithm in a benchmark to help me track each
                            algorithms performance, benchmarking each with my master dataset. To try and improve
                            performance, I made use of grid search for hyper tuning parameters for each algorithm. This
                            also required some research, so could identify which parameters to train for each algorithm,
                            the theory behind them as well as how not to overtrain the algorithms. For this, Sklearn’s
                            documentation on each algorithm was a great guideline to follow. My best model was using the
                            XGBoost algorithm, an ensemble algorithm that uses many weaker algorithms to build a
                            stronger model. It performed with an RMSE of £2,064.48 – much lower than in my scratch
                            implementation of linear and ridge regression.
                            Having read a paper in my research that found predicting individual car makes yielded better
                            results, I also explored this for each of my chosen sklearn algorithms. In doing so, I found
                            that this was indeed the case for my dataset too and I lowered my best model’s price error
                            rate by £100 (RMSE).
                            Finally, taking my best performing model, I was able to create a full stack web application
                            using Django and React as an open-source way for anyone to predict their used car’s prices
                            by inputting a car’s features into a form on a webpage.
                        </Typography>
                        <Typography id="modal-modal-title" variant="h6" component="h2">Data Source</Typography>
                        <Typography id="modal-text" variant="p">
                            The dataset I chose to work with comes from a collaborative data science platform called
                            Kaggle.
                            The dataset consists of 100,000 entries of used car listings that were compiled by using a
                            web scraper from online UK car listing website Exchange and Mart.
                            The data comes split into various car makes including Ford, Mercedes, Audi, BMW, Hyundai,
                            Skoda, Toyota, Vauxhall, Volkswagen.
                            Another notable characteristic is that the dataset was recently updated in 2020 and contains
                            cars priced within the pandemic period.
                        </Typography>
                        <a href="https://www.kaggle.com/datasets/adityadesai13/used-car-dataset-ford-and-mercedes">Link
                            to Data Source</a>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Bias
                        </Typography>
                        <Typography id="modal-text" variant="p">
                            Bias in a dataset can often lead to a model that leans towards a certain class of
                            prediction.
                            This often means that biases need to be checked for and handled in pre-processing or data as
                            well as the capturing of data. For my project, I have tried my best to pick up on any biases
                            within the analysis stage which I will go over in this sub-section, as well as any biases
                            that I
                            may have missed. Some car makes have much more sales data than others. Seeing as some
                            machine
                            learning algorithms generally perform better when there is more data to analyse trends from
                            –
                            this could be a source of bias. The models produced may be able to better predict some car
                            makes
                            due to this issue.
                            Another bias that may exist is between higher and lower end cars.
                            My dataset has a mean price of £16,890. It has a good distribution of higher and lower end
                            cars.
                            However, the dataset has a higher proportion of lower end cars than higher end as can be
                            seen
                            from the above histogram. This may result in the bias that the models produced from this
                            dataset
                            may be able to predict lower to mid end cars better than higher end cars.
                            Another issue is that my dataset only contains 11 car makes. As already concluded from the
                            project, the car make feature is an important one. Each car maker prices its cars
                            differently.
                            This may result in unseen car maker’s price predictions to not be as accurate.
                        </Typography>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Privacy
                        </Typography>
                        <Typography id="modal-text" variant="p">
                            The safety of information is an important topic. The data acquired for use in machine
                            learning
                            algorithms should be fairly obtained. This is especially important if a dataset contains
                            someone’s personal data.
                            I took privacy into consideration when choosing the dataset for my project. The source of my
                            dataset is a popular online used car trading website. All sales entries from the dataset are
                            anonymised and have no personal information of the sellers or buyers of cars.
                        </Typography>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
