import os
import pandas as pd
from datetime import datetime
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split
from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification, Trainer, TrainingArguments
from datasets import Dataset


def train_binary_model(dataset_path: str) -> dict:
    # Load dataset
    df = pd.read_csv(dataset_path)
    if 'text' not in df.columns or 'label' not in df.columns:
        raise ValueError("Dataset must contain 'text' and 'label' columns.")

    # Encode labels
    print("------------------------>")
    print(df['label'].value_counts())

    df['label'] = df['label'].map(lambda x: 1 if x.lower() == 'negative' else 0)

    # Train/test split
    train_texts, val_texts, train_labels, val_labels = train_test_split(
        df['text'], df['label'], test_size=0.2, random_state=42
    )

    # Tokenization
    tokenizer = DistilBertTokenizerFast.from_pretrained("distilbert-base-uncased")
    train_encodings = tokenizer(list(train_texts), truncation=True, padding=True)
    val_encodings = tokenizer(list(val_texts), truncation=True, padding=True)

    # Convert to HuggingFace Datasets
    train_dataset = Dataset.from_dict({
        'input_ids': train_encodings['input_ids'],
        'attention_mask': train_encodings['attention_mask'],
        'labels': list(train_labels)
    })

    val_dataset = Dataset.from_dict({
        'input_ids': val_encodings['input_ids'],
        'attention_mask': val_encodings['attention_mask'],
        'labels': list(val_labels)
    })

    # Model
    model = DistilBertForSequenceClassification.from_pretrained("distilbert-base-uncased", num_labels=2)

    # Training arguments
    training_args = TrainingArguments(
        output_dir="./models/binary_model",
        evaluation_strategy="epoch",
        save_strategy="no",
        num_train_epochs=2,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        logging_dir="./logs",
        logging_steps=10,
        load_best_model_at_end=False
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset
    )

    trainer.train()

    # Evaluation
    preds = trainer.predict(val_dataset)
    pred_labels = preds.predictions.argmax(-1)

    accuracy = accuracy_score(val_labels, pred_labels)
    precision = precision_score(val_labels, pred_labels)
    recall = recall_score(val_labels, pred_labels)
    f1 = f1_score(val_labels, pred_labels)

    metrics = {
        "accuracy": round(accuracy, 4),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1_score": round(f1, 4),
        "last_trained": datetime.utcnow().isoformat()
    }

    return metrics