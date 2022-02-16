import {
  DeleteItemCommand,
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
  PutItemCommandInput,
  ScanCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { DateTime } from "luxon";
import { NoteEntity } from "../entities/note.entity";
import { FlatNote, INotesRepository } from "../interfaces/note";

export class NotesRepository implements INotesRepository {
  constructor(private client: DynamoDBClient, private tableName: string) {}

  async getById(id: string) {
    const command = new GetItemCommand({ TableName: this.tableName, Key: { id: { S: id } } });
    const { Item } = await this.client.send(command);
    if (!Item) {
      return undefined;
    }
    const note = unmarshall(Item) as NoteEntity;

    return note;
  }

  async getItems() {
    const now = Math.trunc(DateTime.now().toMillis() / 1000);

    const { Items } = await this.client.send(
      new ScanCommand({
        TableName: this.tableName,
        ProjectionExpression: "id, createdAt, title",
        FilterExpression: "#ttl >= :now",
        ExpressionAttributeValues: {
          ":now": { N: `${now}` },
        },
        ExpressionAttributeNames: {
          "#ttl": "ttl",
        },
      }),
    );

    const notes = Items || [];

    return notes.map((item) => unmarshall(item) as FlatNote);
  }

  async createItem(entity: NoteEntity) {
    const params: PutItemCommandInput = {
      TableName: this.tableName,
      Item: {
        id: { S: entity.id },
        text: { S: entity.text },
        title: { S: entity.title },
        hash: { S: entity.hash },
        expirationDate: { S: entity.expirationDate },
        createdAt: { S: entity.createdAt },
        updatedAt: { S: entity.updatedAt },
        ttl: { N: (DateTime.fromISO(entity.expirationDate).toMillis() / 1000).toString() },
      },
    };

    await this.client.send(new PutItemCommand(params));
  }

  async removeItem(id: string) {
    await this.client.send(new DeleteItemCommand({ TableName: this.tableName, Key: { id: { S: id } } }));
  }

  async updateItemHash(id: string, newHash: string) {
    const command = new UpdateItemCommand({
      TableName: this.tableName,
      Key: { id: { S: id } },
      UpdateExpression: "set hash = :h, updatedAt = :u",
      ExpressionAttributeValues: { ":h": { S: newHash }, ":u": { S: DateTime.now().toISO() } },
    });

    await this.client.send(command);
  }
}
