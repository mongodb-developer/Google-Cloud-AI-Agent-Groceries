# Simple AI Agent for Grocery Shopping

This is a simple AI Agent for Grocery Shopping built with MongoDB Atlas Vector Search, Google Cloud Gemini, and LangGraph.

## Load sample data

```
npm run embed
```

## Run the Agent

```
npm start
```

## Send prompts

```
curl -X POST http://localhost:8080/messages \
  -H "Content-Type: application/json" \
  -d '{"message": "add eggs, bread and flour to my cart"}'
```

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for detail
