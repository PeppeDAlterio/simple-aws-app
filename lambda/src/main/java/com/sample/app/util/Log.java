package com.sample.app.util;

import com.amazonaws.services.lambda.runtime.LambdaLogger;

public class Log {

    private static LambdaLogger logger;

    public static void setLogger(LambdaLogger newLogger) {
        logger = newLogger;
    }

    public static void log(String message) {
        if(logger!=null) {
            logger.log(message);
        } else {
            System.out.println(message);
        }
    }

}
