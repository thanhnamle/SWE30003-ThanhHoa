using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using FluentAssertions;
using Xunit;
using SmartFM.Application.DTOs.Payments;
using SmartFM.Domain.Enums;
using SmartFM.IntegrationTests.Helpers;

namespace SmartFM.IntegrationTests;

/// <summary>
/// Integration tests for the Payments API controller.
/// </summary>
public class PaymentApiTests : IClassFixture<CustomWebApplicationFactory<Program>>
{
    private readonly HttpClient _client;
    private static readonly System.Text.Json.JsonSerializerOptions JsonOptions = new System.Text.Json.JsonSerializerOptions
    {
        PropertyNameCaseInsensitive = true,
        Converters = { new System.Text.Json.Serialization.JsonStringEnumConverter() }
    };

    public PaymentApiTests(CustomWebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task ProcessPayment_ValidRequest_ShouldReturn_200OK_AndReceiptDetails()
    {
        var request = new ProcessPaymentDto
        {
            Amount = 500m,
            Method = PaymentMethod.BankTransfer
        };

        var response = await _client.PostAsJsonAsync($"/api/payments/invoice/{TestDataSeeder.InvoiceUnpaidId}", request);
        var content = await response.Content.ReadAsStringAsync();

        response.StatusCode.Should().Be(HttpStatusCode.OK, $"Response content: {content}");

        var paymentResult = await response.Content.ReadFromJsonAsync<ReceiptResponseDto>();
        paymentResult.Should().NotBeNull();
        paymentResult!.TransactionReference.Should().NotBeNullOrWhiteSpace();
        paymentResult.SettledAmount.Should().Be(500m);
    }

    [Fact]
    public async Task ProcessPayment_InsufficientAmount_ShouldReturn_400BadRequest()
    {
        var request = new ProcessPaymentDto
        {
            Amount = 499.99m,
            Method = PaymentMethod.CreditCard
        };

        var response = await _client.PostAsJsonAsync($"/api/payments/invoice/{TestDataSeeder.InvoiceUnpaidInsufficientId}", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task ProcessPayment_AlreadyPaidInvoice_ShouldReturn_400BadRequest()
    {
        var request = new ProcessPaymentDto
        {
            Amount = 300m,
            Method = PaymentMethod.Cash
        };

        var response = await _client.PostAsJsonAsync($"/api/payments/invoice/{TestDataSeeder.InvoicePaidId}", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }
}
